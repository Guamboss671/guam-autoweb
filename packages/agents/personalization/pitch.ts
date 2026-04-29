import Anthropic from '@anthropic-ai/sdk';
import type { Lead } from '../../shared/types/index.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateEmailPitch(lead: Lead, previewUrl: string): Promise<{ subject: string; html: string; text: string }> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: `You write short, friendly, locally-relevant outreach emails for a Guam web services company.
The sender's name is Jaren. Tone: genuine, local, not salesy. Keep it under 150 words.
Return valid JSON only.`,
    messages: [
      {
        role: 'user',
        content: `Write a personalized outreach email for:
Business: ${lead.business_name}
Category: ${lead.category}
Has website: ${lead.website ? 'Yes (' + lead.website + ')' : 'No'}
Preview URL: ${previewUrl}

Return JSON:
{
  "subject": "email subject line",
  "bodyText": "plain text email body (no HTML)",
  "personalizedHook": "one sentence specific to their business/category"
}`,
      },
    ],
  });

  const { subject, bodyText, personalizedHook } = JSON.parse(
    (message.content[0] as Anthropic.TextBlock).text
  );

  const html = buildEmailHtml(lead, previewUrl, bodyText, personalizedHook);
  return { subject, html, text: bodyText };
}

function buildEmailHtml(lead: Lead, previewUrl: string, body: string, hook: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
  <h2 style="font-size: 20px;">Hi ${lead.business_name},</h2>
  <p>${hook}</p>
  <p>${body}</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="${previewUrl}"
       style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
      View Your Free Website Preview →
    </a>
  </div>
  <p style="font-size: 14px; color: #666;">No obligation. If you like it, we handle everything for <strong>$79/month</strong> — hosting, updates, SEO, and support included.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 13px; color: #999;">
    Jaren<br>
    Guam Web Services<br>
    (671) XXX-XXXX<br><br>
    <a href="{{unsubscribe_url}}" style="color: #999;">Unsubscribe</a>
  </p>
</body>
</html>`;
}
