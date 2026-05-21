CREATE TYPE event_category AS ENUM ('transport_strike','transport_disruption','public_service_closure','school_closure','healthcare_disruption','municipality_notice','weather_disruption','protest','other');
CREATE TYPE event_status AS ENUM ('confirmed','likely','uncertain','cancelled','resolved');
CREATE TYPE event_severity AS ENUM ('low','medium','high','critical');
CREATE TYPE verification_status AS ENUM ('unverified','candidate','reviewed','verified','stale');
CREATE TYPE source_type AS ENUM ('official_website','rss','api','html','pdf','social','manual','other');
CREATE TYPE candidate_status AS ENUM ('pending','approved','rejected','merged');

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, title text NOT NULL, summary text NOT NULL, description text NOT NULL,
  category event_category NOT NULL, status event_status NOT NULL, severity event_severity NOT NULL,
  starts_at timestamptz NOT NULL, ends_at timestamptz, is_all_day boolean NOT NULL DEFAULT false,
  affected_services text[] NOT NULL DEFAULT '{}', affected_locations text[] NOT NULL DEFAULT '{}',
  municipality text, district text, country text NOT NULL DEFAULT 'PT', source_confidence integer NOT NULL DEFAULT 50,
  verification_status verification_status NOT NULL DEFAULT 'reviewed', last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_slug_idx ON events(slug);
CREATE INDEX events_starts_idx ON events(starts_at);
CREATE INDEX events_ends_idx ON events(ends_at);
CREATE INDEX events_category_idx ON events(category);
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_severity_idx ON events(severity);
CREATE INDEX events_district_idx ON events(district);
CREATE INDEX events_municipality_idx ON events(municipality);
CREATE INDEX events_verification_idx ON events(verification_status);

CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, url text NOT NULL,
  type source_type NOT NULL, country text NOT NULL DEFAULT 'PT', reliability integer NOT NULL DEFAULT 50,
  adapter_key text NOT NULL UNIQUE, is_active boolean NOT NULL DEFAULT true, last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sources_adapter_idx ON sources(adapter_key);

CREATE TABLE event_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  url text NOT NULL, title text, publisher text, source_type source_type NOT NULL, retrieved_at timestamptz NOT NULL,
  raw_text_snippet text, confidence integer NOT NULL DEFAULT 50, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX event_sources_event_idx ON event_sources(event_id);

CREATE TABLE ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid REFERENCES sources(id), adapter_key text NOT NULL, status text NOT NULL,
  started_at timestamptz NOT NULL, finished_at timestamptz, error text, events_found integer NOT NULL DEFAULT 0,
  candidates_created integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ingestion_runs_adapter_idx ON ingestion_runs(adapter_key);

CREATE TABLE candidate_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), ingestion_run_id uuid NOT NULL REFERENCES ingestion_runs(id) ON DELETE CASCADE,
  source_id uuid REFERENCES sources(id), raw_payload jsonb NOT NULL, normalized_payload jsonb NOT NULL,
  status candidate_status NOT NULL DEFAULT 'pending', duplicate_of_event_id uuid REFERENCES events(id),
  reviewer_id text, reviewed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX candidate_events_status_idx ON candidate_events(status);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id text, action text NOT NULL, entity_type text NOT NULL,
  entity_id text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
