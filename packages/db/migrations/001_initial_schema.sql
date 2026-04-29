-- Enable UUID extension
create extension if not exists "pgcrypto";

-- LEADS
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  category text,
  address text,
  city text default 'Guam',
  phone text,
  email text,
  website text,
  google_maps_url text,
  yelp_url text,
  facebook_url text,
  instagram_url text,
  owner_name text,
  hours jsonb,
  photos text[],
  reviews jsonb,
  score integer default 0,
  score_reasons jsonb,
  status text default 'new',
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(business_name, address)
);

-- CLIENTS
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  email text,
  business_name text,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'starter',
  monthly_amount integer,
  status text default 'active',
  onboarded_at timestamptz,
  created_at timestamptz default now()
);

-- SITES
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  client_id uuid references clients(id),
  preview_url text,
  production_url text,
  custom_domain text,
  vercel_project_id text,
  cloudflare_zone_id text,
  site_data jsonb,
  status text default 'generating',
  created_at timestamptz default now()
);

-- OUTREACH
create table if not exists outreach (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  channel text,
  message text,
  subject text,
  status text default 'queued',
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  follow_up_count integer default 0,
  next_follow_up timestamptz
);

-- ANALYTICS REPORTS
create table if not exists analytics_reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  period_start date,
  period_end date,
  page_views integer,
  unique_visitors integer,
  top_pages jsonb,
  search_rankings jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_score_idx on leads(score desc);
create index if not exists outreach_lead_id_idx on outreach(lead_id);
create index if not exists outreach_next_follow_up_idx on outreach(next_follow_up);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();
