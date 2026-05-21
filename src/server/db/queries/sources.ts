import { asc } from 'drizzle-orm';
import { db } from '@/server/db';
import { sources } from '@/server/db/schema';
export function listSources() { return db.select().from(sources).orderBy(asc(sources.name)); }
