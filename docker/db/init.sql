-- ─────────────────────────────────────────────────────────────────────────────
-- TripNest Database Schema
-- PostgreSQL 16
-- Run automatically by docker-compose on first `docker compose up`
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar        TEXT,
  bio           TEXT,
  location      TEXT,
  trips_count   INTEGER DEFAULT 0,
  preferences   JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trips ─────────────────────────────────────────────────────────────────────
CREATE TABLE trips (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  destination  TEXT NOT NULL,
  cover_image  TEXT,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'planning'
                 CHECK (status IN ('planning','upcoming','ongoing','completed','cancelled')),
  trip_type    TEXT NOT NULL DEFAULT 'solo'
                 CHECK (trip_type IN ('solo','couple','family','group','business')),
  travelers    INTEGER DEFAULT 1,
  budget_total NUMERIC(12,2) DEFAULT 0,
  budget_currency TEXT DEFAULT 'USD',
  budget_spent NUMERIC(12,2) DEFAULT 0,
  tags         TEXT[] DEFAULT '{}',
  is_public    BOOLEAN DEFAULT FALSE,
  share_token  TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trips_owner ON trips(owner_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_share_token ON trips(share_token);

-- ── Budget Categories ─────────────────────────────────────────────────────────
CREATE TABLE budget_categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  icon       TEXT,
  allocated  NUMERIC(12,2) DEFAULT 0,
  spent      NUMERIC(12,2) DEFAULT 0,
  color      TEXT DEFAULT '#0ea5e9',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budget_categories_trip ON budget_categories(trip_id);

-- ── Budget Items ──────────────────────────────────────────────────────────────
CREATE TABLE budget_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id     UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category_id UUID REFERENCES budget_categories(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  item_date   DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budget_items_trip ON budget_items(trip_id);

-- ── Itinerary Days ────────────────────────────────────────────────────────────
CREATE TABLE itinerary_days (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id  UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day      INTEGER NOT NULL,
  day_date DATE NOT NULL,
  title    TEXT,
  notes    TEXT,
  UNIQUE (trip_id, day)
);

CREATE INDEX idx_itinerary_days_trip ON itinerary_days(trip_id);

-- ── Activities ────────────────────────────────────────────────────────────────
CREATE TABLE activities (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id       UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  trip_id      UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  location     TEXT,
  period       TEXT CHECK (period IN ('morning','afternoon','evening')),
  duration     TEXT,
  cost         NUMERIC(10,2) DEFAULT 0,
  activity_type TEXT DEFAULT 'activity',
  place_id     UUID,
  image_url    TEXT,
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_day ON activities(day_id);
CREATE INDEX idx_activities_trip ON activities(trip_id);

-- ── Places ────────────────────────────────────────────────────────────────────
CREATE TABLE places (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT,
  address      TEXT,
  category     TEXT,
  rating       NUMERIC(3,1),
  review_count INTEGER DEFAULT 0,
  price_level  SMALLINT CHECK (price_level BETWEEN 1 AND 4),
  image_url    TEXT,
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  opening_hours TEXT,
  phone        TEXT,
  website      TEXT,
  tags         TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trip Places (junction) ────────────────────────────────────────────────────
CREATE TABLE trip_places (
  trip_id    UUID REFERENCES trips(id) ON DELETE CASCADE,
  place_id   UUID REFERENCES places(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (trip_id, place_id)
);

-- ── Shared Access ─────────────────────────────────────────────────────────────
CREATE TABLE shared_access (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id      UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email   TEXT NOT NULL,
  permission   TEXT NOT NULL DEFAULT 'view'
                 CHECK (permission IN ('view','edit','admin')),
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','accepted','declined')),
  invited_at   TIMESTAMPTZ DEFAULT NOW(),
  accepted_at  TIMESTAMPTZ
);

CREATE INDEX idx_shared_access_trip ON shared_access(trip_id);
CREATE INDEX idx_shared_access_user ON shared_access(user_id);
CREATE UNIQUE INDEX idx_shared_access_unique ON shared_access(trip_id, user_email);

-- ── Comments ──────────────────────────────────────────────────────────────────
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES comments(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_trip ON comments(trip_id);

-- ── Activity Log ──────────────────────────────────────────────────────────────
CREATE TABLE activity_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action     TEXT NOT NULL,
  details    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_trip ON activity_logs(trip_id);

-- ── Budget Alerts ─────────────────────────────────────────────────────────────
CREATE TABLE budget_alerts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  alert_type TEXT DEFAULT 'warning' CHECK (alert_type IN ('info','warning','danger')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update updated_at ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at  BEFORE UPDATE ON users  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_trips_updated_at  BEFORE UPDATE ON trips  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
