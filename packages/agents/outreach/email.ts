import { Resend } from 'resend';
import { supabase } from '../../db/index.js';
import { updateLeadStatus, getLeadsByStatus } from '../../db/queries/leads.js';
import { generateEmailPitch } from '../personalization/pitch.js';
import type { Lead } from '../../shared/types/index.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPreviewEmail(lead: Lead, previewUrl: string) {
  const { subject, html, text } = await generateEmailPitch(lead, previewUrl);

  const { data, error } = await resend.emails.send({
    from: `${process.env.OUTREACH_FROM_NAME} <${process.env.OUTREACH_FROM_EMAIL}>`,
    to: lead.email!,
    subject,
    html,
    text,
  });

  if (error) throw error;

  await supabase.from('outreach').insert({
    lead_id: lead.id,
    channel: 'email',
    subject,
    message: text,
    status: 'sent',
    sent_at: new Date().toISOString(),
    next_follow_up: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 days
  });

  await updateLeadStatus(lead.id, 'contacted');
  console.log(`[Outreach] Email sent to ${lead.business_name} (${lead.email})`);
  return data;
}

export async function sendFollowUpEmail(lead: Lead, previewUrl: string, followUpNumber: number) {
  const subjects = [
    `Did you see your website preview, ${lead.business_name}?`,
    `Last chance — your free preview expires soon`,
  ];

  const bodies = [
    `Just checking in — I sent over a free website preview for ${lead.business_name} a few days ago. Would love to know what you think! View it here: ${previewUrl}`,
    `This is my last follow-up. Your free website preview for ${lead.business_name} is still available. If you're interested, just reply to this email. If not, no worries — I hope business is going well!`,
  ];

  const idx = Math.min(followUpNumber - 1, 1);

  await resend.emails.send({
    from: `${process.env.OUTREACH_FROM_NAME} <${process.env.OUTREACH_FROM_EMAIL}>`,
    to: lead.email!,
    subject: subjects[idx],
    text: bodies[idx],
  });

  await supabase
    .from('outreach')
    .update({
      follow_up_count: followUpNumber,
      next_follow_up: followUpNumber >= 2 ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('lead_id', lead.id)
    .eq('channel', 'email');
}

export async function processFollowUps() {
  const { data: pending } = await supabase
    .from('outreach')
    .select('*, leads(*)')
    .lte('next_follow_up', new Date().toISOString())
    .lt('follow_up_count', 2)
    .eq('channel', 'email')
    .eq('status', 'sent');

  if (!pending?.length) return;

  console.log(`[Outreach] Processing ${pending.length} follow-ups`);

  for (const outreach of pending) {
    const lead = outreach.leads as Lead;
    const { data: site } = await supabase
      .from('sites')
      .select('preview_url')
      .eq('lead_id', lead.id)
      .single();

    if (!site?.preview_url) continue;

    await sendFollowUpEmail(lead, site.preview_url, outreach.follow_up_count + 1);
  }
}
