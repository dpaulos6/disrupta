import { describe, expect, it } from 'vitest';
import { dedupeKey } from '@/domain/events/event-deduplication';
describe('dedupeKey',()=>{it('normalizes key',()=>{expect(dedupeKey({title:' A ',municipality:'Lisboa',startsAt:'2026-01-02T10:00:00Z'})).toContain('a::lisboa::2026-01-02');});});
