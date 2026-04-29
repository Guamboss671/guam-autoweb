/**
 * Manually import leads from a CSV or hard-coded list
 * Usage: tsx scripts/seed-leads.ts
 */
import 'dotenv/config';
import { upsertLead } from '../packages/db/queries/leads.js';

const manualLeads = [
  {
    business_name: 'Example Restaurant Guam',
    category: 'Restaurant',
    address: '123 Marine Corps Dr, Tamuning, Guam',
    phone: '+16715551234',
    email: null,
    website: null,
    source: 'manual',
  },
];

async function seed() {
  for (const lead of manualLeads) {
    const saved = await upsertLead(lead);
    console.log('Saved:', saved.business_name);
  }
  console.log('Done seeding.');
  process.exit(0);
}

seed().catch(console.error);
