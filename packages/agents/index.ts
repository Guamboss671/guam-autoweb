import 'dotenv/config';
import { scrapeAllCategories } from './lead-discovery/google-maps.js';
import { qualifyAllNewLeads } from './qualification/scorer.js';
import { buildNextBatch } from './site-builder/deploy.js';
import { processFollowUps } from './outreach/email.js';
import { getLeadsByStatus } from '../db/queries/leads.js';
import { sendPreviewEmail } from './outreach/email.js';
import { sendPreviewSMS } from './outreach/sms.js';
import { supabase } from '../db/index.js';

async function runPipeline() {
  console.log('[Pipeline] Starting Guam AutoWeb pipeline...');

  // 1. Discover new leads (run once daily)
  await scrapeAllCategories();

  // 2. Score and qualify
  await qualifyAllNewLeads();

  // 3. Build sites for top qualified leads
  await buildNextBatch(5);

  // 4. Send outreach for preview-ready leads
  const readyLeads = await getLeadsByStatus('preview_ready', 20);
  for (const lead of readyLeads) {
    const { data: site } = await supabase
      .from('sites')
      .select('preview_url')
      .eq('lead_id', lead.id)
      .single();

    if (!site?.preview_url) continue;

    if (lead.email) {
      await sendPreviewEmail(lead, site.preview_url);
    } else if (lead.phone) {
      await sendPreviewSMS(lead, site.preview_url);
    }

    // Rate limit: 1 outreach per second
    await new Promise(r => setTimeout(r, 1000));
  }

  // 5. Process follow-ups
  await processFollowUps();

  console.log('[Pipeline] Pipeline run complete.');
}

// Run modes
const mode = process.argv[2] ?? 'pipeline';

switch (mode) {
  case 'scrape':
    scrapeAllCategories().then(() => process.exit(0));
    break;
  case 'qualify':
    qualifyAllNewLeads().then(() => process.exit(0));
    break;
  case 'build':
    buildNextBatch(5).then(() => process.exit(0));
    break;
  case 'followups':
    processFollowUps().then(() => process.exit(0));
    break;
  case 'pipeline':
  default:
    runPipeline().then(() => process.exit(0));
}
