import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_SEVERITIES, EVENT_STATUSES, VERIFICATION_STATUSES } from './constants';
export const eventFilterSchema = z.object({
  q: z.string().optional(), category: z.enum(EVENT_CATEGORIES).optional(), status: z.enum(EVENT_STATUSES).optional(),
  district: z.string().optional(), municipality: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional(), page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20)
});
export const normalizedCandidateSchema = z.object({ title: z.string().min(3), summary: z.string().min(5), description: z.string().min(10), category: z.enum(EVENT_CATEGORIES), status: z.enum(EVENT_STATUSES), severity: z.enum(EVENT_SEVERITIES), startsAt: z.string(), endsAt: z.string().optional(), sourceUrl: z.string().url(), municipality: z.string().optional(), district: z.string().optional(), country: z.string().default('PT'), verificationStatus: z.enum(VERIFICATION_STATUSES).default('candidate')});
