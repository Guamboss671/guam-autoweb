import { updateLeadScore, getLeadsByStatus } from '../../db/queries/leads.js';
import type { Lead } from '../../shared/types/index.js';

export function scoreLead(lead: Lead): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // No website at all — highest priority
  if (!lead.website) {
    score += 50;
    reasons.push('No website detected');
  } else if (
    lead.website.includes('facebook.com') ||
    lead.website.includes('instagram.com') ||
    lead.website.includes('linktr.ee')
  ) {
    score += 40;
    reasons.push('Uses social media as website');
  } else if (lead.website.includes('wix.com') || lead.website.includes('weebly.com')) {
    score += 20;
    reasons.push('Outdated DIY website builder');
  } else {
    score += 5;
    reasons.push('Has existing website (lower priority)');
  }

  // Active business signals
  if (lead.reviews && lead.reviews.length >= 20) {
    score += 20;
    reasons.push('High review count — active business');
  } else if (lead.reviews && lead.reviews.length >= 5) {
    score += 10;
    reasons.push('Has reviews — established business');
  }

  // Reachability
  if (lead.email) {
    score += 10;
    reasons.push('Email available for outreach');
  }
  if (lead.phone) {
    score += 5;
    reasons.push('Phone available for SMS outreach');
  }

  // Social presence (means they care about online presence)
  if (lead.facebook_url || lead.instagram_url) {
    score += 5;
    reasons.push('Active on social media');
  }

  // High-value categories
  const highValueCategories = ['restaurant', 'dental', 'medical', 'hotel', 'real estate', 'insurance', 'auto'];
  if (lead.category && highValueCategories.some(c => lead.category!.toLowerCase().includes(c))) {
    score += 10;
    reasons.push('High-value business category');
  }

  return { score: Math.min(100, score), reasons };
}

export async function qualifyAllNewLeads() {
  const leads = await getLeadsByStatus('new', 200);
  console.log(`[Qualification] Scoring ${leads.length} new leads`);

  for (const lead of leads) {
    const { score, reasons } = scoreLead(lead);
    await updateLeadScore(lead.id, score, reasons);
  }

  console.log(`[Qualification] Done scoring ${leads.length} leads`);
}
