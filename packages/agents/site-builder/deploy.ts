import { supabase } from '../../db/index.js';
import { updateLeadStatus } from '../../db/queries/leads.js';
import { generateSiteContent } from './generate-content.js';
import { getQualifiedLeadsForBuilding } from '../../db/queries/leads.js';
import type { Lead } from '../../shared/types/index.js';

export async function buildSiteForLead(lead: Lead): Promise<string> {
  console.log(`[SiteBuilder] Building site for: ${lead.business_name}`);

  // Generate AI content
  const siteData = await generateSiteContent(lead);

  // Create site record
  const { data: site, error } = await supabase
    .from('sites')
    .insert({
      lead_id: lead.id,
      site_data: siteData,
      status: 'generating',
    })
    .select()
    .single();

  if (error) throw error;

  // Deploy to Vercel via API
  const previewUrl = await deployToVercel(lead, siteData, site.id);

  // Update site with preview URL
  await supabase
    .from('sites')
    .update({ preview_url: previewUrl, status: 'preview' })
    .eq('id', site.id);

  await updateLeadStatus(lead.id, 'preview_ready');

  console.log(`[SiteBuilder] Preview ready: ${previewUrl}`);
  return previewUrl;
}

async function deployToVercel(lead: Lead, siteData: any, siteId: string): Promise<string> {
  const projectName = `guam-preview-${siteId.slice(0, 8)}`;

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: projectName,
      framework: 'nextjs',
      // In production: point to the site-template repo + inject siteData as env vars
      gitSource: {
        type: 'github',
        org: 'Guamboss671',
        repo: 'guam-autoweb',
        ref: 'main',
      },
      env: [
        { key: 'SITE_DATA', value: JSON.stringify(siteData), type: 'plain', target: ['production', 'preview'] },
        { key: 'BUSINESS_NAME', value: lead.business_name, type: 'plain', target: ['production', 'preview'] },
        { key: 'SITE_ID', value: siteId, type: 'plain', target: ['production', 'preview'] },
      ],
    }),
  });

  const deployment = await response.json() as any;
  return `https://${deployment.url}`;
}

export async function buildNextBatch(batchSize = 5) {
  const leads = await getQualifiedLeadsForBuilding(batchSize);
  console.log(`[SiteBuilder] Building ${leads.length} sites`);

  for (const lead of leads) {
    try {
      await updateLeadStatus(lead.id, 'building');
      await buildSiteForLead(lead);
    } catch (err) {
      console.error(`[SiteBuilder] Failed for ${lead.business_name}:`, err);
      await updateLeadStatus(lead.id, 'qualified'); // reset for retry
    }
  }
}
