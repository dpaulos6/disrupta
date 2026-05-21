# Disrupta

**Disrupta** is an open-source public disruption intelligence platform.

The first local/country instance is **Disrupta Portugal**, focused on source-linked and community-reviewed civic disruption data for Portugal.

Disrupta tracks strikes, transport disruptions, public service closures, school/university notices, municipality announcements, healthcare disruptions, protests, weather-related disruptions, and other civic/public interruptions.

## Local setup
1. `docker compose up -d`
2. `npm install`
3. `cp .env.example .env`
4. `npm run db:migrate`
5. `npm run seed`
6. `npm run ingest:run`
7. `npm run dev`

## Architecture
- Next.js App Router, server-first pages.
- PostgreSQL + Drizzle ORM + SQL migrations.
- Domain modules under `src/domain`.
- Query layer under `src/server/db/queries`.
- Admin review workflow for candidate events.
- Adapter-based ingestion (`src/ingestion`).
- RPC endpoint at `/api/rpc/*`.

## Public API
- `POST /api/rpc/public/listEvents`
- `POST /api/rpc/public/getEventBySlug`
- `POST /api/rpc/public/listSources`

## Data accuracy disclaimer
This repository ships with **sample data** only. No event should be treated as authoritative without source verification.
