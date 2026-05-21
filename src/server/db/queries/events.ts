import { and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { db } from '@/server/db';
import { eventSources, events } from '@/server/db/schema';
import { eventFilterSchema } from '@/domain/events/schemas';

export async function listEvents(input: unknown) {
  const filters = eventFilterSchema.parse(input ?? {});
  const where = and(
    filters.category ? eq(events.category, filters.category) : undefined,
    filters.status ? eq(events.status, filters.status) : undefined,
    filters.district ? eq(events.district, filters.district) : undefined,
    filters.municipality ? eq(events.municipality, filters.municipality) : undefined,
    filters.startDate ? gte(events.startsAt, new Date(filters.startDate)) : undefined,
    filters.endDate ? lte(events.startsAt, new Date(filters.endDate)) : undefined,
    filters.q ? or(ilike(events.title, `%${filters.q}%`), ilike(events.summary, `%${filters.q}%`), ilike(events.description, `%${filters.q}%`)) : undefined
  );
  return db.select().from(events).where(where).orderBy(filters.q ? desc(sql`ts_rank(to_tsvector(${events.title}), plainto_tsquery(${filters.q}))`) : asc(events.startsAt)).limit(filters.pageSize).offset((filters.page - 1) * filters.pageSize);
}

export async function getEventBySlug(slug: string) {
  const [event] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  if (!event) return null;
  const sources = await db.select().from(eventSources).where(eq(eventSources.eventId, event.id));
  return { event, sources };
}
