export type LeadStatus =
  | 'new'
  | 'qualified'
  | 'building'
  | 'preview_ready'
  | 'contacted'
  | 'replied'
  | 'converted'
  | 'lost';

export type SiteStatus = 'generating' | 'preview' | 'live' | 'suspended';

export type OutreachChannel = 'email' | 'sms' | 'facebook_dm' | 'instagram_dm' | 'form';

export type OutreachStatus =
  | 'queued'
  | 'sent'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'bounced';

export type Plan = 'starter' | 'growth' | 'pro';

export interface Lead {
  id: string;
  business_name: string;
  category: string | null;
  address: string | null;
  city: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  google_maps_url: string | null;
  yelp_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  owner_name: string | null;
  hours: Record<string, string> | null;
  photos: string[];
  reviews: Review[];
  score: number;
  score_reasons: string[];
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Site {
  id: string;
  lead_id: string;
  client_id: string | null;
  preview_url: string | null;
  production_url: string | null;
  custom_domain: string | null;
  vercel_project_id: string | null;
  cloudflare_zone_id: string | null;
  site_data: SiteData | null;
  status: SiteStatus;
  created_at: string;
}

export interface SiteData {
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  aboutText: string;
  services: ServiceItem[];
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
  colorPalette: ColorPalette;
  keywords: string[];
}

export interface ServiceItem {
  name: string;
  description: string;
  price?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Outreach {
  id: string;
  lead_id: string;
  channel: OutreachChannel;
  message: string;
  subject: string | null;
  status: OutreachStatus;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  follow_up_count: number;
  next_follow_up: string | null;
}

export interface Client {
  id: string;
  lead_id: string;
  email: string;
  business_name: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: Plan;
  monthly_amount: number;
  status: 'active' | 'paused' | 'cancelled';
  onboarded_at: string | null;
  created_at: string;
}

export const PLANS: Record<Plan, { name: string; amount: number; features: string[] }> = {
  starter: {
    name: 'Starter',
    amount: 7900,
    features: ['5-page website', 'SSL & hosting', 'Mobile optimized', 'Basic SEO', 'Monthly updates'],
  },
  growth: {
    name: 'Growth',
    amount: 14900,
    features: ['Everything in Starter', 'Google Analytics', 'Booking widget', 'Monthly report', 'Priority email support'],
  },
  pro: {
    name: 'Pro',
    amount: 24900,
    features: ['Everything in Growth', 'AI chatbot', 'Review automation', 'Ads management', 'Reputation monitoring', 'Priority phone support'],
  },
};
