import Anthropic from '@anthropic-ai/sdk';
import type { Lead, SiteData } from '../../shared/types/index.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateSiteContent(lead: Lead): Promise<SiteData> {
  const reviewSummary = lead.reviews
    ?.map(r => `"${r.text}" - ${r.author}`)
    .join('\n') ?? 'No reviews yet';

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `You are a professional copywriter specializing in local Guam business websites.
Write warm, friendly, locally-relevant content that resonates with the Guam community.
Reference island culture naturally — CHamoru hospitality, aloha spirit, local pride.
Always optimize for local SEO. Return only valid JSON, no markdown.`,
    messages: [
      {
        role: 'user',
        content: `Generate professional website content for this Guam business:

Business Name: ${lead.business_name}
Category: ${lead.category ?? 'Local Business'}
Address: ${lead.address ?? 'Guam'}
Phone: ${lead.phone ?? 'N/A'}
Customer Reviews:
${reviewSummary}

Return JSON exactly matching this structure:
{
  "tagline": "short memorable tagline",
  "heroHeadline": "compelling headline (8-12 words)",
  "heroSubtext": "supporting subtitle (20-30 words)",
  "aboutText": "two paragraphs about the business, warm and local",
  "services": [
    { "name": "service name", "description": "one sentence", "price": "optional" }
  ],
  "ctaText": "call to action button text",
  "seoTitle": "SEO page title including Guam (under 60 chars)",
  "seoDescription": "meta description including Guam (under 160 chars)",
  "colorPalette": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor"
  },
  "keywords": ["keyword1", "keyword2", "...up to 8 keywords"]
}`,
      },
    ],
  });

  const text = (message.content[0] as Anthropic.TextBlock).text;
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned) as SiteData;
}
