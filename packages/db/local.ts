/**
 * Local JSON file database — drop-in replacement for Supabase during dev.
 * Switch to packages/db/index.ts (Supabase) when ready.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Lead, LeadStatus } from '../shared/types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '../../data/leads.json');

function readLeads(): Lead[] {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeLeads(leads: Lead[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));
}

export function getAllLeads(): Lead[] {
  return readLeads();
}

export function getLeadsByStatus(status: LeadStatus, limit = 50): Lead[] {
  return readLeads()
    .filter(l => l.status === status)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function upsertLead(data: Partial<Lead>): Lead {
  const leads = readLeads();
  const existing = leads.findIndex(
    l => l.business_name === data.business_name && l.address === data.address
  );

  const now = new Date().toISOString();
  const lead: Lead = {
    id: data.id ?? `lead-${Date.now()}`,
    business_name: data.business_name ?? '',
    category: data.category ?? null,
    address: data.address ?? null,
    city: data.city ?? 'Guam',
    phone: data.phone ?? null,
    email: data.email ?? null,
    website: data.website ?? null,
    google_maps_url: data.google_maps_url ?? null,
    yelp_url: data.yelp_url ?? null,
    facebook_url: data.facebook_url ?? null,
    instagram_url: data.instagram_url ?? null,
    owner_name: data.owner_name ?? null,
    hours: data.hours ?? null,
    photos: data.photos ?? [],
    reviews: data.reviews ?? [],
    score: data.score ?? 0,
    score_reasons: data.score_reasons ?? [],
    status: data.status ?? 'new',
    source: data.source ?? 'manual',
    created_at: data.created_at ?? now,
    updated_at: now,
  };

  if (existing >= 0) {
    leads[existing] = { ...leads[existing], ...lead, updated_at: now };
  } else {
    leads.push(lead);
  }

  writeLeads(leads);
  return lead;
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx >= 0) {
    leads[idx].status = status;
    leads[idx].updated_at = new Date().toISOString();
    writeLeads(leads);
  }
}

export function updateLeadScore(id: string, score: number, reasons: string[]) {
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx >= 0) {
    leads[idx].score = score;
    leads[idx].score_reasons = reasons;
    leads[idx].status = score >= 50 ? 'qualified' : 'new';
    leads[idx].updated_at = new Date().toISOString();
    writeLeads(leads);
  }
}

export function getQualifiedLeadsForBuilding(limit = 10): Lead[] {
  return readLeads()
    .filter(l => l.status === 'qualified' && l.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function updateLead(id: string, data: Partial<Lead>) {
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], ...data, updated_at: new Date().toISOString() };
    writeLeads(leads);
  }
}
