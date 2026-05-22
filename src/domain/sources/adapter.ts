import { z } from 'zod';
import { normalizedCandidateSchema } from '@/domain/events/schemas';
export const sourceAdapterResultSchema = z.object({ rawPayload: z.unknown(), normalized: normalizedCandidateSchema.array() });
export type SourceAdapterResult = z.infer<typeof sourceAdapterResultSchema>;
export interface SourceAdapter { key: string; run: () => Promise<SourceAdapterResult>; }
