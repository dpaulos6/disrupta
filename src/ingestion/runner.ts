import { db } from '@/server/db';
import { candidateEvents, ingestionRuns, sources } from '@/server/db/schema';
import { adapterRegistry } from './registry';
import { eq } from 'drizzle-orm';

export async function runIngestion() {
  for (const adapter of adapterRegistry) {
    const startedAt = new Date();
    const [source] = await db.select().from(sources).where(eq(sources.adapterKey, adapter.key)).limit(1);
    const [run] = await db.insert(ingestionRuns).values({ adapterKey: adapter.key, sourceId: source?.id, status: 'running', startedAt }).returning();
    try {
      const result = await adapter.run();
      for (const candidate of result.normalized) {
        await db.insert(candidateEvents).values({ ingestionRunId: run.id, sourceId: source?.id, rawPayload: result.rawPayload, normalizedPayload: candidate, status: 'pending' });
      }
      await db.update(ingestionRuns).set({ status: 'completed', finishedAt: new Date(), eventsFound: result.normalized.length, candidatesCreated: result.normalized.length }).where(eq(ingestionRuns.id, run.id));
    } catch (error) {
      await db.update(ingestionRuns).set({ status: 'failed', finishedAt: new Date(), error: error instanceof Error ? error.message : 'unknown error' }).where(eq(ingestionRuns.id, run.id));
    }
  }
}
