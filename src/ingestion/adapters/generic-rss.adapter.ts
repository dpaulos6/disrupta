import type { SourceAdapter } from '@/domain/sources/adapter';
export const genericRssAdapter: SourceAdapter = { key: 'generic.rss', async run() { return { rawPayload: { note: 'Implement RSS parsing per source feed.' }, normalized: [] }; } };
