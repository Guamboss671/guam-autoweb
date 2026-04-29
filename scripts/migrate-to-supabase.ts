/**
 * One-time migration: push local leads.json into Supabase
 * Usage: npx tsx scripts/migrate-to-supabase.ts
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { getAllLeads } from '../packages/db/local.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrate() {
  const leads = getAllLeads();
  console.log(`Migrating ${leads.length} leads to Supabase...`);

  const { error } = await supabase
    .from('leads')
    .upsert(leads, { onConflict: 'business_name,address' });

  if (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }

  console.log(`Done. ${leads.length} leads in Supabase.`);
  process.exit(0);
}

migrate().catch(console.error);
