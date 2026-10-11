# RAAAH — Intelligent Crowd Management and Smart Tourism Platform

FYP, FAST-NUCES Chiniot-Faisalabad. Implementation follows the SRS, [docs/RAAAH_SRS.docx](docs/RAAAH_SRS.docx).

## Project structure (SRS Fig. 1, 37, 38, 45)

| Folder | Component | Technology |
|---|---|---|
| `frontend/` | Tourist Portal UI / Admin Dashboard UI | Next.js (React) |
| `backend/` | Backend API Server | Node.js + Express.js, PostgreSQL, Redis cache |
| `ai-engine/` | AI Recommendation Engine | Python + FastAPI + Scikit-learn |
| `deploy/` | Application hosting environment | Docker Compose, HTTPS proxy |
| `docs/` | SRS, testing, deployment and maintenance documents | |
| `scripts/` | Development helper (`npm run dev`) | |

```
frontend/
  app/                    Tourist Pages and Admin Dashboard Pages (one folder per page)
  components/             Shared UI Components
  lib/api.js              API Client
  context/, constants/    session state, routes, roles, crowd and risk levels
backend/src/
  modules/auth            Authentication and Profile Service (UC-02)
  modules/profile         Authentication and Profile Service (UC-03)
  modules/destinations    Destination Information Service (UC-04) + OpenWeatherMap
  modules/crowd           Crowd Monitoring Service (UC-06)
  modules/recommendations Recommendation Service (UC-09)
  data/models             Data Access Layer: Database Models
  data/repositories       Data Access Layer: Repositories
  data/cache.js           Data Access Layer: Cache Access (Redis or in-memory)
  integrations/           External Service Integrations: OpenWeatherMap, AI engine client
  db/                     schema.sql (ERD, Fig. 44), migrate, seed
backend/tests/            unit and integration tests, one file per use case
ai-engine/app/
  data_preparation.py     Data Preparation
  scoring.py              Destination Scoring
  ranking.py              Ranking
ai-engine/tests/          tests of the recommendation engine
deploy/                   docker-compose.yml and HTTPS proxy (Deployment Diagram, Fig. 45)
docs/                     RAAAH_SRS.docx, TESTING.md, DEPLOYMENT.md, MAINTENANCE.md
```

The full mapping of folders to the Package Diagram is in [docs/MAINTENANCE.md](docs/MAINTENANCE.md).

## Running locally

Requirements: Node.js 22+, Python 3.11+. All commands are run from this folder.

```bash
npm run setup     # once: installs the dependencies of frontend/, backend/ and ai-engine/
npm run dev       # database, tables and demo data, API, AI engine and web client together
```

| | |
|---|---|
| Web client | http://localhost:3000 |
| Backend API | http://localhost:5000/api/health |
| AI engine | http://localhost:8000/health |

Press Ctrl+C to stop everything. Each part can also be started in its own terminal:
`npm run db`, `npm run api`, `npm run ai`, `npm run web`.

Useful commands in `backend/`: `npm run db:reset` (recreate everything) and `npm run seed:crowd`
(refresh demo crowd levels — demo check-ins close automatically after `CHECKIN_AUTO_CLOSE_HOURS`).

Optional keys: `OPENWEATHER_API_KEY` in `backend/.env` for live weather (without it the last stored
weather is shown with its update time), and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `frontend/.env.local`
for the interactive map with crowd-coloured markers (without it a keyless Google Maps embed is shown).
See `frontend/.env.local.example`.

### Demo accounts (password `Raaah@2026`)

| Email | Role |
|---|---|
| tourist@raaah.pk | Tourist (location consent off — enable it on the Profile page) |
| observer@raaah.pk | Community Safety Observer |
| admin@raaah.pk | Administrator |
| authority@raaah.pk | Tourism Authority |

**Testing check-in:** check-in only works inside the destination area (FR-03.01). To demo it from
anywhere, open Chrome/Edge DevTools → More tools → Sensors → Location, and enter the destination
coordinates shown on its page (e.g. Hunza Valley 36.3236, 74.6660).

## Implemented in this phase — SRS traceability

| Use case | Requirements | Where |
|---|---|---|
| UC-02 Login | FR-01.03, SRS 3.3.3 (hashed passwords, server-side RBAC) | `backend/src/modules/auth`, `backend/src/middleware/auth.js`, `frontend/app/login`, `frontend/components/RequireAuth.js` |
| UC-03 Manage Profile and Preferences | FR-01.02, FR-01.04, FR-01.05, FR-01.07 | `backend/src/modules/profile`, `frontend/app/profile` |
| UC-04 Explore Destinations | FR-02.01–FR-02.06, FR-03.06, FR-06.03, SRS 3.3.5 | `backend/src/modules/destinations`, `frontend/app/destinations` |
| UC-06 Check In at Destination | FR-03.01–FR-03.07, SRS 3.3.4, 3.3.7 | `backend/src/modules/crowd`, `frontend/components/destinations/CheckInPanel.js` |
| UC-09 Get Alternative Destination Recommendations | FR-04.03, FR-05.01–FR-05.06 | `backend/src/modules/recommendations`, `ai-engine/`, `frontend/app/recommendations` |

Each normal and alternative flow of the expanded use cases is handled, e.g. UC-02 4a invalid
credentials, UC-03 4a invalid information (previous values kept), UC-04 3a no destinations found /
5a last available weather / 6a warning with alternatives, UC-06 2a permission denied / 3a outside area,
UC-09 6a no suitable alternative / 7a continue with the original destination.

**Crowd classification (Table 11)** — ratio = active check-ins ÷ capacity threshold:
Low < 0.6 ≤ Moderate < 1.0 ≤ High ≤ 1.2 < Critical (`backend/src/domain.js`).

**Recommendation engine (FR-05.05, content-based)** — hard filters remove High Risk, Critical crowd,
closed destinations and anything more crowded or riskier than the selected destination. Remaining
candidates get a weighted score: preference match (cosine similarity, scikit-learn) 30%, crowd 20%,
safety 20%, weather 10%, distance 10%, accessibility 5%, accommodation 5%; previously visited
destinations stay eligible with a 10% lower score (FR-04.03). Every result is stored in the
`recommendations` table (DFD D7).

### Additions to the ERD
`destinations.latitude/longitude` (the ERD "location"; PostGIS is used automatically when installed),
`area_radius_m` (FR-03.01), `attractions`, `activities` (FR-02.04), `accommodation_available` (FR-05.03),
`destination_interests` table (FR-05.03) and `weather_info` table (WeatherInfo in the Domain Model).

### Not yet implemented (next phase)
UC-01 Register and UC-10 Report Hazard (forms only, they say so), UC-05, UC-07 explicit Check Out
button, UC-08, UC-11 – UC-17. The dashboard shows live crowd and risk totals; the rest of UC-17 follows.

### Interface
Editorial layout: Newsreader for headings, IBM Plex Sans/Mono for text and figures, warm paper
background, one link colour and four condition colours (tokens in `frontend/app/globals.css`). Shared pieces
live in `frontend/components/ui`. Earlier prototype pages that showed invented data and features outside the SRS
(crowd-map "sensors", hotel business portal, accommodation booking, mock trips) were moved to
`frontend/_archive/` and are not part of the app; delete that folder once you no longer need it.

## Tests
```bash
npm test                  # backend (133 tests, needs `npm run db` or `npm run dev` running) + AI engine (14 tests)
npm run lint              # web client
npm run build             # web client, production build
```
The backend tests use their own `raaah_test` database and never touch development data. Test cases
are traced to the use case flows in [docs/TESTING.md](docs/TESTING.md), which also has the browser
checklist. GitHub Actions runs everything on each push (`.github/workflows/ci.yml`).

## Deployment and maintenance
```bash
cd deploy && copy .env.example .env       # fill in SITE_ADDRESS, POSTGRES_PASSWORD, JWT_SECRET
docker compose up -d --build
```
One container per node of the Deployment Diagram (Fig. 45), behind HTTPS. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the steps and settings, and
[docs/MAINTENANCE.md](docs/MAINTENANCE.md) for monitoring, backups, failure behaviour and how to
change the system.

Destination photos are from Wikimedia Commons under free licences; see each file page for attribution.
