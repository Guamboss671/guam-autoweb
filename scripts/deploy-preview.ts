/**
 * Generate AI content for a lead and deploy a preview site to Vercel
 * Usage: npx tsx scripts/deploy-preview.ts "Butterhouse Barber & Beauty Salon"
 */
import 'dotenv/config';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { generateSiteContent } from '../packages/agents/site-builder/generate-content.js';
import type { Lead } from '../packages/shared/types/index.js';

const businessName = process.argv[2];
if (!businessName) {
  console.error('Usage: npx tsx scripts/deploy-preview.ts "Business Name"');
  process.exit(1);
}

const LEADS: Record<string, Partial<Lead>> = {
  'Butterhouse Barber & Beauty Salon': { category: 'Barber & Beauty Salon', address: '141 Macheche Ave, Dededo, Guam 96929', city: 'Dededo', phone: null },
  'Lovely Nails':                      { category: 'Nail Salon',            address: '2239 Rt 16, Ste 109-A, Dededo, Guam', city: 'Dededo', phone: '+16716466244' },
  "Geno's Auto Service Guam":          { category: 'Auto Repair',           address: '1354 Army Drive, Barrigada, Guam 96913', city: 'Barrigada', phone: '+16716337287' },
  'Da Local Grindhouse':               { category: 'Restaurant',            address: 'Purple Heart Highway, Barrigada, Guam 96913', city: 'Barrigada', phone: '+16719693688' },
  'Sty Frsh':                          { category: 'Barbershop',            address: 'Guam', city: 'Guam', phone: null },
};

const info = LEADS[businessName] ?? { category: 'Local Business', address: 'Guam', city: 'Guam', phone: null };

const lead: Lead = {
  id: 'preview',
  business_name: businessName,
  category: info.category ?? 'Local Business',
  address: info.address ?? 'Guam',
  city: info.city ?? 'Guam',
  phone: info.phone ?? null,
  email: null,
  website: null,
  google_maps_url: null,
  yelp_url: null,
  facebook_url: null,
  instagram_url: null,
  owner_name: null,
  hours: null,
  photos: [],
  reviews: [],
  score: 60,
  score_reasons: [],
  status: 'qualified',
  source: 'manual',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

async function main() {
  console.log(`\n[1/3] Generating AI content for: ${businessName}...`);
  const siteData = await generateSiteContent(lead);
  const encoded = Buffer.from(JSON.stringify(siteData)).toString('base64');

  // Write env vars to site-template for the deployment
  const templateDir = path.join(process.cwd(), 'apps', 'site-template');
  const envPath = path.join(templateDir, '.env.production');

  fs.writeFileSync(envPath, [
    `SITE_DATA_B64=${encoded}`,
    `BUSINESS_NAME=${businessName}`,
    `BUSINESS_ADDRESS=${info.address ?? 'Guam'}`,
    `BUSINESS_PHONE=${info.phone ?? ''}`,
    `SITE_ID=preview`,
    `SITE_STATUS=preview`,
  ].join('\n'));

  console.log(`[2/3] Deploying to Vercel...`);

  try {
    // Strip Vercel project-specific env vars so CLI creates a fresh project
    const env = { ...process.env };
    delete env.VERCEL_ORG_ID;
    delete env.VERCEL_PROJECT_ID;

    const result = execSync(
      `npx vercel deploy ${templateDir} --prod --yes --token=${process.env.VERCEL_TOKEN} --scope guamboss671s-projects`,
      { encoding: 'utf-8', cwd: process.cwd(), env }
    );

    const aliasMatch = result.match(/Aliased:\s+(https:\/\/[^\s\[]+)/);
    const prodMatch = result.match(/Production:\s+(https:\/\/[^\s\[]+)/);
    const url = (aliasMatch?.[1] ?? prodMatch?.[1] ?? '').trim();

    console.log(`[3/3] Done!\n`);
    console.log(`Preview URL: ${url}`);
    console.log(`\nSend this link to ${businessName}!`);

    return url;
  } finally {
    // Clean up production env file
    if (fs.existsSync(envPath)) fs.unlinkSync(envPath);
  }
}

main().catch(console.error);
