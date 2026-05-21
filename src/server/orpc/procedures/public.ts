import { z } from 'zod';
import { getEventBySlug, listEvents } from '@/server/db/queries/events';
import { listSources } from '@/server/db/queries/sources';
export const listEventsInput = z.object({ q: z.string().optional(), category: z.string().optional(), status: z.string().optional(), district: z.string().optional(), municipality: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional(), page: z.coerce.number().optional(), pageSize: z.coerce.number().optional() });
export async function listEventsProcedure(input: unknown) { return listEvents(listEventsInput.parse(input)); }
export async function getEventBySlugProcedure(input: unknown) { const parsed = z.object({ slug: z.string().min(1) }).parse(input); return getEventBySlug(parsed.slug); }
export async function listSourcesProcedure() { return listSources(); }
