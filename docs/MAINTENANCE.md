# RAAAH — Maintenance

How the system is kept running and how it is changed. The structure follows the Package Diagram
(SRS Figure 38) so that a change stays inside one package (SRS 3.3.8 Maintainability).

## Where things are

| Package (Fig. 38) | Folder |
|---|---|
| **Presentation Layer** — Tourist Pages | `frontend/app/` (`login`, `profile`, `destinations`, `recommendations`, …) |
| Presentation Layer — Admin Dashboard Pages | `frontend/app/analytics-dashboard` |
| Presentation Layer — Shared UI Components | `frontend/components/`, `frontend/components/ui` |
| Presentation Layer — API Client | `frontend/lib/api.js` |
| **Application Layer** — Authentication and Profile | `backend/src/modules/auth`, `backend/src/modules/profile` |
| Application Layer — Destinations | `backend/src/modules/destinations` |
| Application Layer — Crowd Monitoring | `backend/src/modules/crowd` |
| Application Layer — Recommendations | `backend/src/modules/recommendations` |
| **Data Access Layer** — Database Models | `backend/src/data/models`, schema in `backend/src/db/schema.sql` |
| Data Access Layer — Repositories | `backend/src/data/repositories` |
| Data Access Layer — Cache Access | `backend/src/data/cache.js` |
| **External Service Integrations** — OpenWeatherMap Client | `backend/src/integrations/openWeatherMapClient.js` |
| External Service Integrations — Google Maps Client | `frontend/components/destinations/DestinationMap.js` (called from the browser, Fig. 37) |
| **AI Recommendation Service** — Data Preparation, Destination Scoring, Ranking | `ai-engine/app/data_preparation.py`, `scoring.py`, `ranking.py` |

Packages of later phases get their own folder beside these: Visit History, Safety and Hazard
Reports, Notifications, Admin and Analytics under `backend/src/modules`, and the Firebase Messaging
Client under `backend/src/integrations`.

Inside a backend module, `*Routes.js` only reads the request and writes the response; the rules of
the use case are in `*Service.js`; SQL is only in the repositories.

## Making a change

1. Change the code in the package it belongs to.
2. Add or update the test of the affected flow (`docs/TESTING.md` lists them by use case).
3. In the project root run `npm test` (backend and AI engine), `npm run lint` and `npm run build`
   (web client), and for a change a tourist can see, the system tests (`npm run test:e2e`, see
   `docs/TESTING.md`). GitHub Actions runs all of them, and builds the Docker images, on every push.
4. Deploy with `docker compose up -d --build` (`docs/DEPLOYMENT.md`).

### Common changes

| Change | Where |
|---|---|
| Crowd level limits (Table 11) | `CROWD_BANDS` in `backend/src/domain.js`; tests in `tests/unit/domain.test.js` |
| Capacity threshold or area radius of a destination | `destinations.capacity_threshold`, `area_radius_m` (UC-15 will add the screen) |
| Automatic check-out time, refresh intervals | `CHECKIN_AUTO_CLOSE_HOURS`, `CROWD_REFRESH_SECONDS`, `WEATHER_REFRESH_MINUTES` |
| What counts as unfavourable weather | `UNFAVOURABLE_CODES` in `backend/src/modules/destinations/weatherService.js` |
| Importance of each recommendation factor | `WEIGHTS` in `ai-engine/app/scoring.py` (must add up to 1; a test checks it) |
| Travel preferences (FR-01.04) | `INTERESTS` in `backend/src/domain.js` and the `interests` table |
| Sign-in protection | `LOGIN_MAX_FAILURES`, `LOGIN_LOCK_MINUTES` |
| Photo sizes | `WIKIMEDIA_WIDTHS` in `frontend/lib/imageLoader.mjs` (only widths Wikimedia serves) |
| A new table or column | `backend/src/db/schema.sql`, written so it can run again on an existing database (`IF NOT EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS`) |

### Replacing the recommendation model

The Application Server only knows the engine through one request, `POST /recommendations/score`
(`ai-engine/app/schemas.py`). A retrained or ML-based model (FR-05.05) can replace `scoring.py` as
long as that request and response stay the same; nothing in the backend or the web client changes.

## Monitoring

| Check | How | Healthy answer |
|---|---|---|
| Application Server, database and AI Server | `GET /api/health` | `{"status":"ok","database":"up","cache":"redis","postgis":true,"aiEngine":"up"}` |
| AI Server | `GET /health` on port 8000 | `{"status":"ok", …}` |
| Containers | `docker compose ps` | all `running` / `healthy` |
| Logs | `docker compose logs -f api` | one line per request with status and duration |

`/api/health` answers 503 when the database cannot be reached; the compose file uses it as the
health check of the `api` container. `"aiEngine":"down"` means the AI Server did not answer within
3 seconds; the API itself stays `ok`, since only recommendations need the engine. Requests slower than 3 seconds in the log are worth looking at
(SRS 3.3.2). The log has no request bodies or query strings, so no passwords or locations are
written to it.

## Behaviour when something fails (SRS 3.3.5)

| Failure | What users see | Action |
|---|---|---|
| OpenWeatherMap unavailable or no key | Last stored weather with its update time; the service is asked again a minute later, by one server instance only | none; it recovers by itself |
| AI Server down | "The recommendation engine is currently unavailable"; everything else works | `docker compose restart ai` |
| Redis down at start-up | Nothing; an in-memory cache is used | restart `cache`, then `api` |
| Database down | API answers 503 on `/api/health`, pages show an error | `docker compose restart db`; check disk space |
| Tourist forgets to leave | Check-in closes after `CHECKIN_AUTO_CLOSE_HOURS` and the visit is recorded | none |
| Someone tries many passwords | After `LOGIN_MAX_FAILURES` failures that email is paused for `LOGIN_LOCK_MINUTES` from that address | none; it ends by itself |

## Backup and restore

```bash
# backup (run daily, keep the file off the server)
docker compose exec -T db pg_dump -U raaah -Fc raaah > raaah-$(date +%F).dump

# restore into an empty database
docker compose exec -T db pg_restore -U raaah -d raaah --clean --if-exists < raaah-2026-10-11.dump
```

Redis is not backed up. It holds crowd levels, which are recalculated from the database, and the
list of logged-out sessions, which it writes to its own volume so that a restart does not make a
logged-out session valid again. Each entry expires with its session (8 hours at most). Logged-out
sessions are also in the database (`revoked_tokens`), together with recent failed sign-ins
(`login_failures`); the refresh cycle deletes both once they no longer matter.

## Security upkeep

- Change `JWT_SECRET` if it may have leaked; every user then has to log in again.
- Run `npm audit` in `frontend/` and in `backend/`, and `pip list --outdated` in `ai-engine/`,
  once a month; update, run the tests, deploy.
- Restrict the Google Maps key to the site's domain in the Google Cloud console.
- Passwords are stored only as bcrypt hashes; nobody, including administrators, can read them.
- The web client sends a content security policy (`frontend/next.config.mjs`) that lists every
  outside address the browser may load from. A new external service (for example Firebase in
  UC-13) has to be added there, or the browser blocks it.

## Development database

`npm run dev` in the project root starts everything; `npm run db` starts only the local PostgreSQL,
which keeps its data in `backend/.pgdata`. In `backend/`:
`npm run db:migrate` updates the tables, `npm run db:seed` loads demo data once,
`npm run db:reset` recreates everything, and `npm run seed:crowd` refreshes the demo crowd (demo
check-ins close after `CHECKIN_AUTO_CLOSE_HOURS` like any other, so run it before a demonstration).
