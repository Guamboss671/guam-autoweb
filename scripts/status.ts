/**
 * Show pipeline status for all leads
 * Usage: npx tsx scripts/status.ts
 */
import { getAllLeads } from '../packages/db/local.js';

const leads = getAllLeads();

const STATUS_ICONS: Record<string, string> = {
  new: '⬜',
  qualified: '🔵',
  building: '🟡',
  preview_ready: '🟣',
  contacted: '🟠',
  replied: '🟢',
  converted: '✅',
  lost: '❌',
};

console.log('\n=== GUAM AUTOWEB — LEAD PIPELINE ===\n');
console.log(`Total leads: ${leads.length}\n`);

const byStatus = leads.reduce((acc, l) => {
  acc[l.status] = (acc[l.status] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

for (const [status, count] of Object.entries(byStatus)) {
  console.log(`  ${STATUS_ICONS[status] ?? '⬜'} ${status.padEnd(15)} ${count}`);
}

console.log('\n--- LEADS (sorted by score) ---\n');

for (const lead of leads.sort((a, b) => b.score - a.score)) {
  console.log(`${STATUS_ICONS[lead.status] ?? '⬜'} [${String(lead.score).padStart(3)}] ${lead.business_name}`);
  console.log(`       Category : ${lead.category ?? 'Unknown'}`);
  console.log(`       Status   : ${lead.status}`);
  console.log(`       Reasons  : ${lead.score_reasons.join(', ')}`);
  console.log();
}
