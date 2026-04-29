import { supabase } from '../index.js';
import type { Lead, LeadStatus } from '../../shared/types/index.js';

export async function upsertLead(data: Partial<Lead>) {
  const { data: lead, error } = await supabase
    .from('leads')
    .upsert(data, { onConflict: 'business_name,address' })
    .select()
    .single();
  if (error) throw error;
  return lead as Lead;
}

export async function getLeadsByStatus(status: LeadStatus, limit = 50) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', status)
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Lead[];
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function updateLeadScore(id: string, score: number, reasons: string[]) {
  const { error } = await supabase
    .from('leads')
    .update({ score, score_reasons: reasons, status: score >= 50 ? 'qualified' : 'new' })
    .eq('id', id);
  if (error) throw error;
}

export async function getQualifiedLeadsForBuilding(limit = 10) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'qualified')
    .gte('score', 50)
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Lead[];
}
