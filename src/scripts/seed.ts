import { db } from '@/server/db';
import { candidateEvents, eventSources, events, ingestionRuns, sources } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

async function upsertSource(name: string, slug: string, url: string, adapterKey: string) {
  const [existing] = await db.select().from(sources).where(eq(sources.slug, slug)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(sources).values({ name, slug, url, adapterKey, type: 'official_website', reliability: 80 }).returning();
  return created;
}

async function main() {
  const cp = await upsertSource('CP Portugal (sample)', 'cp-sample', 'https://example.org/cp', 'mock.manual');
  const sns = await upsertSource('SNS Portugal (sample)', 'sns-sample', 'https://example.org/sns', 'generic.rss');
  const eventData = [
    ['lisboa-metro-strike-sample','Lisbon Metro Strike (sample)','Sample data for local development only.','transport_strike','high','confirmed','Lisboa','Lisboa'],
    ['cp-regional-delay-sample','CP Regional Delay (sample)','Sample transport disruption.','transport_disruption','medium','likely','Setúbal','Setúbal'],
    ['porto-municipal-notice-sample','Porto Municipal Notice (sample)','Sample municipality service notice.','municipality_notice','low','confirmed','Porto','Porto'],
    ['faro-citizen-service-closure-sample','Faro Citizen Service Closure (sample)','Sample public service closure event.','public_service_closure','medium','confirmed','Faro','Faro'],
    ['coimbra-hospital-partial-disruption-sample','Coimbra Healthcare Disruption (sample)','Sample healthcare disruption.','healthcare_disruption','high','uncertain','Coimbra','Coimbra']
  ] as const;
  for (const e of eventData) {
    const [existing] = await db.select().from(events).where(eq(events.slug, e[0])).limit(1);
    if (existing) continue;
    const [created] = await db.insert(events).values({ slug: e[0], title: e[1], summary: e[2], description: `${e[2]} Not real-world data.`, category: e[3], severity: e[4], status: e[5], startsAt: new Date(Date.now()+86400000), municipality: e[6], district: e[7], verificationStatus: 'reviewed' }).returning();
    await db.insert(eventSources).values({ eventId: created.id, url: 'https://example.org/source', sourceType: 'manual', retrievedAt: new Date(), confidence: 70, title: `${e[1]} source` });
  }
  const [run] = await db.insert(ingestionRuns).values({ adapterKey: 'mock.manual', sourceId: cp.id, status: 'completed', startedAt: new Date(), finishedAt: new Date(), eventsFound: 1, candidatesCreated: 1 }).returning();
  await db.insert(candidateEvents).values({ ingestionRunId: run.id, sourceId: sns.id, rawPayload: { sample: true }, normalizedPayload: { title: 'Setúbal ferry disruption (candidate sample)', summary: 'Sample pending review candidate', description: 'Sample candidate event requiring admin review.', category: 'transport_disruption', status: 'likely', severity: 'medium', startsAt: new Date(Date.now() + 172800000).toISOString(), sourceUrl: 'https://example.org/ferry' }, status: 'pending' });
}

main();
