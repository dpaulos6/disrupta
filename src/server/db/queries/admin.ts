import { and, eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { auditLogs, candidateEvents, eventSources, events } from '@/server/db/schema';

export function listPendingCandidates() { return db.select().from(candidateEvents).where(eq(candidateEvents.status, 'pending')); }

export async function approveCandidate(candidateId: string, reviewerId: string) {
  return db.transaction(async (tx) => {
    const [candidate] = await tx.select().from(candidateEvents).where(and(eq(candidateEvents.id, candidateId), eq(candidateEvents.status, 'pending'))).limit(1);
    if (!candidate) throw new Error('Candidate not found');
    const payload = candidate.normalizedPayload as Record<string, unknown>;
    const [created] = await tx.insert(events).values({
      slug: String(payload.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: String(payload.title), summary: String(payload.summary), description: String(payload.description),
      category: payload.category as never, status: payload.status as never, severity: payload.severity as never,
      startsAt: new Date(String(payload.startsAt)), endsAt: payload.endsAt ? new Date(String(payload.endsAt)) : null,
      municipality: (payload.municipality as string | undefined) ?? null, district: (payload.district as string | undefined) ?? null,
      verificationStatus: 'reviewed', lastVerifiedAt: new Date()
    }).returning();
    await tx.insert(eventSources).values({ eventId: created.id, url: String(payload.sourceUrl), sourceType: 'manual', retrievedAt: new Date(), confidence: 70 });
    await tx.update(candidateEvents).set({ status: 'approved', reviewerId, reviewedAt: new Date() }).where(eq(candidateEvents.id, candidateId));
    await tx.insert(auditLogs).values({ actorId: reviewerId, action: 'candidate.approved', entityType: 'candidate_event', entityId: candidateId, metadata: { eventId: created.id } });
  });
}

export async function rejectCandidate(candidateId: string, reviewerId: string) {
  await db.transaction(async (tx) => {
    await tx.update(candidateEvents).set({ status: 'rejected', reviewerId, reviewedAt: new Date() }).where(eq(candidateEvents.id, candidateId));
    await tx.insert(auditLogs).values({ actorId: reviewerId, action: 'candidate.rejected', entityType: 'candidate_event', entityId: candidateId, metadata: {} });
  });
}
