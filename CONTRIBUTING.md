# Contributing to Disrupta
## Add a source adapter
1. Add a new adapter file in `src/ingestion/adapters/...`.
2. Implement `SourceAdapter` from `src/domain/sources/adapter.ts`.
3. Return normalized candidate events (never publish directly).
4. Register it in `src/ingestion/registry.ts`.
5. Run `npm run ingest:run` and verify candidate events in admin review.

## Standards
- Keep adapters deterministic and source-linked.
- Do not auto-publish candidate events.
- Add or update tests in `src/tests/unit`.
