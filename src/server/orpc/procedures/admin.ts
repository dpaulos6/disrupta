import { z } from 'zod';
import { approveCandidate, listPendingCandidates, rejectCandidate } from '@/server/db/queries/admin';
import { requireAdmin } from '@/server/auth';
export async function listCandidateEventsProcedure() { await requireAdmin(); return listPendingCandidates(); }
export async function approveCandidateEventProcedure(input: unknown) { const { email } = await requireAdmin(); const p = z.object({ candidateId: z.string().uuid() }).parse(input); await approveCandidate(p.candidateId, email); return { ok: true }; }
export async function rejectCandidateEventProcedure(input: unknown) { const { email } = await requireAdmin(); const p = z.object({ candidateId: z.string().uuid() }).parse(input); await rejectCandidate(p.candidateId, email); return { ok: true }; }
