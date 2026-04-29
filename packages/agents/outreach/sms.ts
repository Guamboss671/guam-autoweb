import twilio from 'twilio';
import { supabase } from '../../db/index.js';
import type { Lead } from '../../shared/types/index.js';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendPreviewSMS(lead: Lead, previewUrl: string) {
  if (!lead.phone) throw new Error('No phone number for lead');

  const message = `Hi ${lead.business_name}! I built a free website preview for you: ${previewUrl} — Reply YES if interested or STOP to opt out. -Jaren, Guam Web Services`;

  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_FROM_NUMBER,
    to: lead.phone,
  });

  await supabase.from('outreach').insert({
    lead_id: lead.id,
    channel: 'sms',
    message,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });

  console.log(`[Outreach] SMS sent to ${lead.business_name} (${lead.phone})`);
}
