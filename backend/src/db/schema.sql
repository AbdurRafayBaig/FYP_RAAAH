-- =====================================================================
-- RAAAH database schema (PostgreSQL)
-- Follows the Entity Relationship Diagram, SRS Figure 44.
-- Additions beyond the ERD are marked "ERD extension" with the
-- requirement that needs them.
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
  user_id          SERIAL PRIMARY KEY,
  full_name        VARCHAR(100) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  password_hash    VARCHAR(255) NOT NULL,
  role             VARCHAR(30)  NOT NULL DEFAULT 'tourist'
                   CHECK (role IN ('tourist', 'community_safety_observer', 'administrator', 'tourism_authority')),
  tourist_code     VARCHAR(20)  UNIQUE,
  location_consent BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interests (
  interest_id SERIAL PRIMARY KEY,
  name        VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_interests (
  user_id     INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  interest_id INTEGER NOT NULL REFERENCES interests(interest_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE IF NOT EXISTS destinations (
  destination_id     SERIAL PRIMARY KEY,
  name               VARCHAR(120) NOT NULL,
  description        TEXT         NOT NULL,
  region             VARCHAR(120) NOT NULL,
  -- "location" in the ERD; when PostGIS is installed it is used for area checks
  latitude           DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude          DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  area_radius_m      INTEGER      NOT NULL DEFAULT 5000 CHECK (area_radius_m > 0), -- ERD extension: FR-03.01 destination area
  capacity_threshold INTEGER      NOT NULL CHECK (capacity_threshold > 0),
  crowd_level        VARCHAR(10)  NOT NULL DEFAULT 'Low'
                     CHECK (crowd_level IN ('Low', 'Moderate', 'High', 'Critical')),
  risk_status        VARCHAR(15)  NOT NULL DEFAULT 'Low Risk'
                     CHECK (risk_status IN ('Low Risk', 'Elevated Risk', 'High Risk')),
  access_info        JSONB        NOT NULL DEFAULT '{"status": "Open"}', -- { status: Open|Limited|Closed, road, notes }
  attractions        TEXT[]       NOT NULL DEFAULT '{}', -- ERD extension: FR-02.04 attractions
  activities         TEXT[]       NOT NULL DEFAULT '{}', -- ERD extension: FR-02.04 activities
  accommodation_available INTEGER NOT NULL DEFAULT 0 CHECK (accommodation_available >= 0), -- ERD extension: FR-05.03
  image_url          TEXT,
  is_active          BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ERD extension: FR-02.04 photographs of the destination's viewpoints ([{ src, caption, author, licence }]),
-- altitude and best time to visit, shown on the destination page
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS altitude_m INTEGER CHECK (altitude_m > 0);
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS best_season VARCHAR(120);

-- ERD extension: destination characteristics used by the content-based recommender (FR-05.03)
CREATE TABLE IF NOT EXISTS destination_interests (
  destination_id INTEGER NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  interest_id    INTEGER NOT NULL REFERENCES interests(interest_id) ON DELETE CASCADE,
  PRIMARY KEY (destination_id, interest_id)
);

CREATE TABLE IF NOT EXISTS saved_destinations (
  user_id        INTEGER     NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  destination_id INTEGER     NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  saved_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, destination_id)
);

CREATE TABLE IF NOT EXISTS check_ins (
  checkin_id     SERIAL PRIMARY KEY,
  user_id        INTEGER     NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  destination_id INTEGER     NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  checkin_time   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checkout_time  TIMESTAMPTZ,
  status         VARCHAR(15) NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'checked_out', 'auto_closed'))
);
CREATE INDEX IF NOT EXISTS idx_check_ins_destination_status ON check_ins (destination_id, status);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_status ON check_ins (user_id, status);
-- One active check-in per tourist at a time
CREATE UNIQUE INDEX IF NOT EXISTS uq_check_ins_one_active_per_user ON check_ins (user_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS visits (
  visit_id       SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  destination_id INTEGER NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  visit_date     DATE    NOT NULL DEFAULT CURRENT_DATE,
  duration_min   INTEGER NOT NULL DEFAULT 0 CHECK (duration_min >= 0)
);
CREATE INDEX IF NOT EXISTS idx_visits_user ON visits (user_id);

CREATE TABLE IF NOT EXISTS recommendations (
  recommendation_id          SERIAL PRIMARY KEY,
  user_id                    INTEGER      NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  source_destination_id      INTEGER      REFERENCES destinations(destination_id) ON DELETE SET NULL,
  recommended_destination_id INTEGER      NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  score                      NUMERIC(5,4) NOT NULL,
  rank_position              INTEGER      NOT NULL,
  created_at                 TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hazard_reports (
  report_id      SERIAL PRIMARY KEY,
  observer_id    INTEGER      NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  destination_id INTEGER      NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  reviewed_by    INTEGER      REFERENCES users(user_id) ON DELETE SET NULL,
  hazard_type    VARCHAR(30)  NOT NULL
                 CHECK (hazard_type IN ('Flash Flood', 'Landslide', 'Rockfall', 'Glacier-related Hazard', 'Road Blockage', 'Extreme Weather')),
  location       VARCHAR(255) NOT NULL,
  description    TEXT         NOT NULL,
  status         VARCHAR(15)  NOT NULL DEFAULT 'Unverified'
                 CHECK (status IN ('Unverified', 'Under Review', 'Verified', 'Resolved', 'Rejected')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id         INTEGER      NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  destination_id  INTEGER      REFERENCES destinations(destination_id) ON DELETE CASCADE,
  report_id       INTEGER      REFERENCES hazard_reports(report_id) ON DELETE SET NULL,
  title           VARCHAR(150) NOT NULL,
  message         TEXT         NOT NULL,
  is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
  sent_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cultural_info (
  info_id        SERIAL PRIMARY KEY,
  destination_id INTEGER      NOT NULL REFERENCES destinations(destination_id) ON DELETE CASCADE,
  category       VARCHAR(20)  NOT NULL
                 CHECK (category IN ('tradition', 'etiquette', 'history', 'food', 'guideline')),
  title          VARCHAR(150) NOT NULL,
  content        TEXT         NOT NULL
);

-- ERD extension: FR-01.03 log out. Logged-out sessions are kept here as well as in the cache, so a
-- logout holds on every instance of the Application Server, also when they do not share a Redis cache.
CREATE TABLE IF NOT EXISTS revoked_tokens (
  jti        VARCHAR(64) PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL
);

-- ERD extension: SRS 3.3.3 data security. Failed sign-ins per email and network address, so that
-- passwords cannot be guessed by trying many in a row.
CREATE TABLE IF NOT EXISTS login_failures (
  failure_id SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL,
  ip_address VARCHAR(64)  NOT NULL,
  failed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_login_failures_email_ip ON login_failures (email, ip_address, failed_at);

-- ERD extension: SRS 3.3.3 password reset by email. Only a SHA-256 hash of the emailed token is kept;
-- a token works once and for a short time. Sessions signed in before a reset are no longer accepted.
CREATE TABLE IF NOT EXISTS password_resets (
  token_hash CHAR(64)    PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets (user_id, created_at);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

-- WeatherInfo from the Domain Model (SRS Figure 46): last available weather per destination,
-- shown with its update time when the weather service is unavailable (SRS 3.3.5).
CREATE TABLE IF NOT EXISTS weather_info (
  destination_id INTEGER PRIMARY KEY REFERENCES destinations(destination_id) ON DELETE CASCADE,
  temperature    NUMERIC(5,1) NOT NULL,
  condition      VARCHAR(60)  NOT NULL,
  description    VARCHAR(120),
  weather_code   INTEGER,
  icon           VARCHAR(10),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
-- Which server instance is renewing the weather, so the service is asked once and not by every
-- instance at the same moment (SRS 3.3.2; the free OpenWeatherMap plan allows 60 calls a minute)
ALTER TABLE weather_info ADD COLUMN IF NOT EXISTS refresh_claimed_at TIMESTAMPTZ;
