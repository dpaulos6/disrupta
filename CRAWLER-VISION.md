# Disrupta crawler vision and cost model

Status: proposed direction, not an implemented integration. Reviewed 16 November 2026.

## Recommendation

Pilot `apify/website-content-crawler` against a small set of official Portuguese sources before building custom collectors. Keep source interpretation, validation, event deduplication, and editorial review inside Disrupta. Introduce focused Crawlee collectors where the pilot demonstrates a quality, control, or cost advantage.

The goal is a reliable disruption monitoring service: find relevant announcements, preserve evidence, detect updates, and publish reviewed events. Broadly indexing entire websites is unnecessary for the initial product.

## Current repository state

The repository has an ingestion scaffold, but no live crawler:

- `src/ingestion/runner.ts` records runs and inserts pending candidates.
- `src/ingestion/adapters/mock.adapter.ts` produces a sample event.
- `src/ingestion/adapters/generic-rss.adapter.ts` is a placeholder returning no events.
- `src/domain/sources/adapter.ts` defines the adapter result contract.
- `src/domain/events/schemas.ts` defines normalized candidates.
- Candidate review, transactional approval, and audit logging exist.
- The deduplication helper is not connected to ingestion. Repeated collection is not idempotent.
- No recurring collection scheduler is implemented.

The previous repository assessment also found failing typechecking/test setup, header-based admin identity, and a review screen without candidate content. Resolve these before operating a public review/publishing workflow. This document does not implement those fixes or authorize migrations.

## Collection and processing direction

```text
Configured official sources
  -> RSS/API collection where suitable, otherwise scoped website crawling
  -> source documents and retrieval evidence
  -> relevance filtering and change detection
  -> structured disruption extraction
  -> runtime validation and event deduplication
  -> pending candidates
  -> human review
  -> published events and reviewed updates
```

Prefer RSS or official APIs when available. Use website collection for sources without a suitable feed. Run collection separately from web requests; import completed batches through a server-side integration.

The existing adapter contract is a useful boundary, but it expects normalized events. Raw crawler documents need an intermediate processing step before they satisfy that contract. Long-running asynchronous collection may also require changes to the current runner; compatibility is a design goal, not a drop-in guarantee.

Preserve source URL, retrieval time, publisher/source identity, relevant original text, and upstream run identity. Track content hashes and processing versions so unchanged content does not repeatedly consume extraction resources. Treat fetched content as untrusted input, including when sending it to an LLM.

Extraction must distinguish publication time from disruption time, handle Europe/Lisbon time and daylight saving, and identify affected services/locations. One notice may describe multiple events. Multiple notices may describe one event. Missing dates should trigger review rather than invented values. Corrections and cancellations should become proposed updates linked to existing events.

Do not infer resolution from a page disappearing or being absent from a crawl. Preserve human approval as the publication boundary.

## Website Content Crawler assessment

The Actor provides scoped link discovery, static/browser collection, cleaned text/Markdown, and URL/retrieval metadata. Incremental mode returns changed-page deltas and depends on upstream sitemap/conditional-request behavior. Linked documents can be downloaded. It does not itself turn notices into Disrupta events. [Actor documentation](https://apify.com/apify/website-content-crawler)

Important configuration risks:

- Default cleanup removes `[role="alert"]` and `[role="banner"]`; these could contain service notices. Configure removal rules per source.
- Article-oriented transformers may lose short alerts or tables. Compare extracted content with the original page.
- Linked-file download is not a completed PDF text/OCR pipeline. The current file control is `saveContentTypes`; `saveFiles` is deprecated.
- Disable optional AI summaries initially. Use preserved source text for extraction and review.
- Set explicit result, scope, and runtime limits; inspect skipped URLs and failures.

These controls are documented in the [input schema](https://apify.com/apify/website-content-crawler/input-schema). Source-specific performance and completeness remain untested.

## Build versus use

| Approach | Benefit | Work Disrupta still owns |
| --- | --- | --- |
| Website Content Crawler on Apify | Fastest way to test broad content collection | Source configuration, event extraction, validation, updates, review |
| Custom Crawlee Actor on Apify | Precise selectors and collection behavior | Collector implementation/maintenance plus the same event pipeline |
| Self-hosted Crawlee | Infrastructure control | All collector work plus hosting, scheduling, monitoring, recovery |

Using Crawlee on Apify means packaging our collector as an Actor. It is not a separate Crawlee hosting tariff. Crawlee already supplies queues, retries, HTTP/browser crawling, and concurrency controls; rebuilding these is unnecessary. [Crawlee documentation](https://crawlee.dev/js/docs/introduction)

## Verified billing inputs

USD, monthly billing, before taxes. Prices can change.

| Item | Published rate |
| --- | --- |
| Free plan | $0 subscription; $5 monthly usage credit |
| Starter | $19/month including $19 usage credit |
| Free/Starter compute | $0.20/CU |
| Residential proxy | $8/GB |
| External transfer | $0.20/GB |
| Dataset storage | $1 per 1,000 GB-hours |

Credits cover eligible usage, rather than being an additional charge. Free access stops when its allowance is exhausted. For Starter, model the bill as `19 + max(0, eligible monthly usage - 19)`, before taxes and other purchases. Both our own Actors and pay-per-usage Actors consume platform usage. [Apify pricing](https://apify.com/pricing)

One CU is 1 GB of allocated memory running for one hour. Sum memory-times-duration across runs, including overlapping runs. Memory also affects CPU allocation, so reducing memory does not guarantee a cheaper completed job. [Actor resource documentation](https://docs.apify.com/actors/running/usage-and-resources)

Website Content Crawler currently has no base developer surcharge: platform usage is billed. Its README gives approximate costs of $0.20/1,000 pages for raw HTTP and $0.50-$5/1,000 for browser crawling, based on a stated $0.25/CU baseline. That conflicts with the current $0.20 Free/Starter rate. We retain these published page estimates unchanged as rough planning guidance, not current quotes or measured performance. Optional summaries add cost. [Actor cost explanation](https://apify.com/apify/website-content-crawler#how-much-does-it-cost)

## Daily usage simulation

### Shared workload assumptions

These are hypothetical workloads, not benchmark results. A page visit includes rechecking an existing page; it does not mean a new event. Monthly figures use 30 days.

| Scenario | Example daily behavior | Visits/day | Visits/month |
| --- | --- | ---: | ---: |
| Pilot | 5 sources, 2 checks/day, average 10 visits/source/check | 100 | 3,000 |
| Small service | 20 sources, 2 checks/day, average 25 visits/source/check | 1,000 | 30,000 |
| Wider coverage | 50 sources, 4 checks/day, average 25 visits/source/check | 5,000 | 150,000 |

The average includes listing pages and linked details. It assumes tightly scoped collection, not complete site recrawls. Initial backfills, retries, and extra document downloads increase workload. Higher polling frequency improves freshness but needs its own budget.

### Option A: Website Content Crawler

Assume 80% of visits use raw HTTP and 20% use browser rendering. Applying the published page estimates gives:

```text
Cost per 1,000 mixed visits
  = 0.8 x $0.20 + 0.2 x ($0.50 to $5.00)
  = $0.26 to $1.16
```

| Scenario | Indicative crawl usage/day | Indicative crawl usage/month | Starter bill floor using only this estimate |
| --- | ---: | ---: | ---: |
| Pilot | $0.026-$0.116 | $0.78-$3.48 | $19 |
| Small service | $0.26-$1.16 | $7.80-$34.80 | $19-$34.80 |
| Wider coverage | $1.30-$5.80 | $39-$174 | $39-$174 |

The 80/20 split is an assumption, not a promise about adaptive mode. If all 30,000 monthly visits require a browser, the same published estimate becomes $15-$150. Do not separately add assumed compute to this page-based estimate; that would double count the crawl computation. Add separately metered extras as applicable.

### Option B: our own Crawlee Actor on Apify

There is no benchmark for our unbuilt collector. Instead, the following model assigns explicit hypothetical daily runtimes. These are total billed runtime across all batches, including assumed startup overhead. They are not target speeds or evidence that custom collection is cheaper.

| Scenario | HTTP allocation/runtime per day | Browser allocation/runtime per day | CU/day | Compute/day | Compute/month | Starter bill floor, compute only |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| Pilot | 1 GB for 5 min | 2 GB for 5 min | 0.25 | $0.05 | $1.50 | $19 |
| Small service | 1 GB for 15 min | 2 GB for 15 min | 0.75 | $0.15 | $4.50 | $19 |
| Wider coverage | 1 GB for 60 min | 2 GB for 60 min | 3.00 | $0.60 | $18.00 | $19 |

Worked small-service example:

```text
HTTP:   1 GB x 15/60 hours = 0.25 CU/day
Browser: 2 GB x 15/60 hours = 0.50 CU/day
Total: 0.75 CU/day x $0.20 = $0.15/day
30 days: $4.50 compute
```

This assumes processing 800 HTTP visits and 200 browser visits in the assigned daily runtimes using suitable concurrency. Actual source latency, rate limits, browser requirements, failures, and batch count could invalidate it. If runtime is five times higher, small-service compute becomes $22.50/month before extras. If an Actor runs continuously at 2 GB for 30 days, compute alone is $288; use scheduled finite jobs rather than leaving idle workers running.

Both options have the same underlying compute rate. The tables use different estimation methods and do not establish relative efficiency. Benchmark identical URLs and equivalent output requirements before comparing them.

### Extras that can change the bill

For either option, keep these outside the headline crawl/compute tables:

- **Residential traffic sensitivity:** at 1,000 visits/day and an assumed 0.2 MB/visit, routing every visit through residential proxies uses approximately 6 GB/month and adds $48. Routing only the 20% browser subset this way gives 1.2 GB and $9.60. This excludes retry/subrequest inflation and uses decimal units. Actual browser traffic can be much larger. Residential proxies should be source-specific, not a default requirement.
- **Transfer sensitivity:** 6 GB of separately billable external transfer adds $1.20. Confirm the actual billed traffic categories; do not treat this as a substitute for proxy charges.
- **Retention sensitivity:** keeping a constant 1 GB dataset for 720 hours costs $0.72 in timed dataset storage, before operations. This is not the same as adding 1 GB every day. Request queues and key-value stores have separate rates.
- **Other platform usage:** dataset/queue operations, document storage, builds, debugging screenshots, and failed runs. Record these from actual billing instead of assuming they are free.
- **Outside collection:** structured event extraction/LLM calls, PDF parsing/OCR, Disrupta hosting/database, and human review. No model/provider has been selected, so these are not priced here.

The unit rates above come from [Apify's pricing table](https://apify.com/pricing). Volumes and calculations are our assumptions.

For a concrete small-service illustration, custom compute ($4.50) plus the 20%-residential case ($9.60) plus external transfer ($1.20) totals $15.30/month before storage/operations, fitting inside Starter's $19 credit if remaining usage stays below $3.70. The comparable Website Content Crawler planning range is $18.60-$45.60 before storage/operations, producing a Starter bill floor of $19-$45.60. These examples exclude downstream extraction and use unverified traffic/runtime assumptions.

## Pilot and decision gates

1. Choose three official sources: article notices, short alerts/tables, and PDF announcements. Confirm actual endpoints and allowed collection behavior.
2. Establish a manually checked set of relevant notices, including an update/cancellation. Set scope and per-run limits; preserve robots rules and reasonable per-domain concurrency.
3. Run Website Content Crawler, compare original pages with extracted evidence, and tune cleaning. Do not enable automatic publishing.
4. Repeat daily for a week. Measure missed notices, lost dates/tables, failures, unnecessary reprocessing, runtime, proxy bytes, and total billed usage.
5. Test event extraction and candidate review. Ensure an unchanged rerun creates no duplicate candidate and an update proposes a change to the correct event.
6. Build one custom Crawlee collector only where there is a demonstrated reason. Compare the same source set, retention, and completeness requirements.

Suggested initial operating target: evaluate whether collection fits a $19/month Starter budget, with a manually chosen account spending cap. This is a target to validate, not an affordability guarantee. The free allowance may support the pilot if total usage fits; do not rely on it for uninterrupted monitoring.

Choose Website Content Crawler when its configuration preserves the evidence and collection cost is acceptable. Choose custom Crawlee when source structure, precision, or measured cost justifies ongoing maintenance. A hybrid source-by-source approach is expected.

This document proposes future phases only. No Apify runs, paid resources, production dependencies, database migrations, or application changes were created for this assessment.
