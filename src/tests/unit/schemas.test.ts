import { describe, expect, it } from 'vitest';
import { eventFilterSchema, normalizedCandidateSchema } from '@/domain/events/schemas';

describe('event schemas', () => {
  it('parses event filters', () => {
    const parsed = eventFilterSchema.parse({ page: '2', pageSize: '10', category: 'transport_strike' });
    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(10);
  });

  it('validates normalized candidates', () => {
    const parsed = normalizedCandidateSchema.parse({ title: 'Sample', summary: 'Summary text', description: 'Long enough description', category: 'other', status: 'likely', severity: 'low', startsAt: new Date().toISOString(), sourceUrl: 'https://example.org' });
    expect(parsed.category).toBe('other');
  });
});
