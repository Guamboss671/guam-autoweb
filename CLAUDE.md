# Guam AutoWeb — Project Context

## What This Is
Automated lead-gen + website creation system targeting Guam small businesses with no website.
Pipeline: scrape Google Maps → qualify leads → AI-generate a preview site → email/SMS the owner → convert to paid subscriber.

## Owner
Jaren (jarentaitano.jt@gmail.com) — GitHub: Guamboss671
Repo: https://github.com/Guamboss671/guam-autoweb.git

## Tech Stack
- Monorepo with Turborepo (workspaces: apps/*, packages/*)
- `apps/dashboard` — Next.js 14 admin dashboard (port 3000)
- `apps/site-template` — Next.js 14 generated business site template (port 3001)
- `packages/agents` — pipeline agents (lead discovery, qualification, site builder, outreach, subscription)
- `packages/db` — Supabase client + local JSON fallback adapter
- Supabase (Postgres), Stripe, Resend (email), Twilio (SMS), Apify (scraping), Vercel (deployment), Cloudflare (DNS)

## Current Progress (as of 2026-04-29)

### Done
- [x] Full project scaffold committed and pushed to GitHub
- [x] 5 manual leads loaded into `data/leads.json`: Butterhouse, Lovely Nails, Geno's Auto Service Guam, Da Local Grindhouse, Sty Frsh
- [x] Local JSON DB adapter (`packages/db/local.ts`) — mirrors Supabase interface so dev works offline
- [x] Supabase migration script ready (`scripts/migrate-to-supabase.ts`)
- [x] Anthropic API key set in `.env`
- [x] Database schema SQL written (`packages/db/migrations/001_initial_schema.sql`)

### Not Done Yet
- [ ] `npm install` — dependencies not installed (no node_modules)
- [ ] Supabase project setup — URL and keys still placeholder in `.env`
- [ ] Apify token (for Google Maps scraping)
- [ ] Resend API key (for email outreach)
- [ ] Twilio credentials (for SMS outreach)
- [ ] Stripe keys + price IDs
- [ ] Vercel token (for site deployment)
- [ ] Cloudflare token (for DNS/custom domains)

## Next Steps (in order)
1. **npm install** — run in project root
2. **Supabase** — create project at supabase.com, copy Project URL + service_role key + anon key into `.env`, then run `scripts/migrate-to-supabase.ts` to push schema
3. **Test pipeline locally** — run `npm run dev` to see dashboard, verify leads show up
4. **Site template** — generate preview sites for the 5 leads using AI content generator
5. **Outreach** — set up Resend + Twilio, send preview emails to leads

## Key Files
- `.env` — all API keys (Anthropic key is set; rest are placeholders)
- `data/leads.json` — 5 manual leads (local dev data)
- `packages/db/local.ts` — local adapter (used when Supabase not configured)
- `packages/db/migrations/001_initial_schema.sql` — run this in Supabase SQL editor
- `scripts/migrate-to-supabase.ts` — one-shot script to push local leads → Supabase
- `scripts/status.ts` — view current lead statuses
- `packages/agents/index.ts` — main pipeline runner

## How to Run
```bash
# Install deps (first time)
npm install

# Start dev servers
npm run dev

# Run pipeline manually
npm run agents:dev pipeline

# Check lead status
npx tsx scripts/status.ts
```
