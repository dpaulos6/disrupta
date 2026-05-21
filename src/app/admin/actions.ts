'use server';
import { approveCandidate, rejectCandidate } from '@/server/db/queries/admin';
import { requireAdmin } from '@/server/auth';
export async function approveCandidateAction(formData: FormData) { const { email } = await requireAdmin(); await approveCandidate(String(formData.get('candidateId')), email); }
export async function rejectCandidateAction(formData: FormData) { const { email } = await requireAdmin(); await rejectCandidate(String(formData.get('candidateId')), email); }
