/**
 * Generate AI site content for a lead and write it to site-template/.env.local
 * Usage: npx tsx scripts/preview-lead.ts "Butterhouse"
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { generateSiteContent } from '../packages/agents/site-builder/generate-content.js';
import type { Lead } from '../packages/shared/types/index.js';

const businessName = process.argv[2] ?? 'Butterhouse';

const lead: Lead = {
  id: 'preview',
  business_name: businessName,
  category: businessName === 'Butterhouse' ? 'Bakery / Cafe' :
            businessName === 'Lovely Nails' ? 'Nail Salon' :
            businessName === "Geno's Auto Service Guam" ? 'Auto Repair' :
            businessName === 'Da Local Grindhouse' ? 'Restaurant' :
            businessName === 'Sty Frsh' ? 'Barbershop' : 'Local Business',
  address: 'Guam',
  city: 'Guam',
  phone: null,
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
  console.log(`Generating site content for: ${businessName}...`);
  const siteData = await generateSiteContent(lead);
  console.log('Generated:', JSON.stringify(siteData, null, 2));

  const envPath = path.join(process.cwd(), 'apps', 'site-template', '.env.local');
  const encoded = Buffer.from(JSON.stringify(siteData)).toString('base64');
  const envContent = [
    `SITE_DATA_B64=${encoded}`,
    `BUSINESS_NAME=${businessName}`,
    `SITE_ID=preview`,
    `SITE_STATUS=preview`,
  ].join('\n');

  fs.writeFileSync(envPath, envContent);
  console.log(`\nWrote to ${envPath}`);
  console.log('Now run: cd apps/site-template && npx next dev -p 3001');
}

main().catch(console.error);
