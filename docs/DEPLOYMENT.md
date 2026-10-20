# RAAAH — Deployment

Follows the Deployment Diagram (SRS Figure 45): one cloud server running the Web Server, the
Application Server, the AI Server, PostgreSQL + PostGIS and Redis, reached by the browser over HTTPS.

## Nodes and artifacts

| Node in Fig. 45 | Artifact | Container | Built from | Reachable from |
|---|---|---|---|---|
| Web Server (Next.js) | RAAAH Frontend | `web` | `frontend/Dockerfile` | browser, through the HTTPS proxy |
| Application Server (Node.js + Express.js) | REST API | `api` | `backend/Dockerfile` | browser at `/api`, through the HTTPS proxy |
| AI Server (Python + Scikit-learn) | Recommendation Engine | `ai` | `ai-engine/Dockerfile` | `api` only (HTTP REST) |
| Database server (PostgreSQL + PostGIS) | RAAAH Database | `db` | `postgis/postgis` image | `api` only (TCP/IP, SQL) |
| Cache server (Redis) | Crowd and Status Cache | `cache` | `redis` image | `api` only (TCP/IP) |
| — | HTTPS certificate and routing | `proxy` | `caddy` image | ports 80 and 443 |

The external services of the diagram are called from where the diagram shows them: OpenWeatherMap
from the Application Server, Google Maps from the browser. Firebase Cloud Messaging belongs to
UC-13 and is not deployed in this phase.

HTTPS matters for more than security (SRS 3.3.3): browsers only give a page the device location
over HTTPS, so check-in (UC-06) does not work on a plain HTTP address other than `localhost`.

## Requirements

A Linux server (2 GB RAM or more) with Docker Engine and the Compose plugin, ports 80 and 443 open,
and a domain name pointing to the server.

## First deployment

```bash
git clone <repository> raaah && cd raaah/deploy
cp .env.example .env
# edit .env: SITE_ADDRESS, POSTGRES_PASSWORD, JWT_SECRET, and the API keys you have

docker compose up -d --build
docker compose ps            # every service should become "healthy" / "running"
```

The Application Server creates or updates the database tables each time it starts
(`backend/src/db/schema.sql`). To load the demonstration destinations and accounts once:

```bash
docker compose exec api node src/db/seed.js
```

The demo accounts share a published password. Use them for demonstrations only, and change or
remove them before real tourists use the system.

Open `https://<SITE_ADDRESS>`. With a real domain the certificate is issued automatically; with
`SITE_ADDRESS=localhost` the browser warns once about the local certificate.

## Settings (`deploy/.env`)

| Setting | Needed | Purpose |
|---|---|---|
| `SITE_ADDRESS` | yes | Public domain name of the site |
| `POSTGRES_PASSWORD` | yes | Database password (letters and digits) |
| `JWT_SECRET` | yes | Signs login sessions; the server refuses to start in production without it |
| `OPENWEATHER_API_KEY` | no | Live weather (FR-02.06); without it the last stored weather is shown |
| `GOOGLE_MAPS_API_KEY`, `GOOGLE_MAPS_MAP_ID` | no | Interactive map (FR-02.02); without it a keyless embed is shown |
| `CHECKIN_AUTO_CLOSE_HOURS` | no | Automatic check-out time (FR-03.02), default 6 |
| `CROWD_REFRESH_SECONDS` | no | How often crowd levels are recalculated, default 60 |
| `WEATHER_REFRESH_MINUTES` | no | How long fetched weather is reused, default 10 |
| `JWT_EXPIRES_IN` | no | Session length, default 8h |
| `LOGIN_MAX_FAILURES`, `LOGIN_LOCK_MINUTES` | no | Sign-in is paused for an email and address after this many failed attempts, for this long; default 5 and 15 (SRS 3.3.3) |

The Google Maps key is compiled into the web client, so changing it needs
`docker compose up -d --build web`. Other settings take effect with `docker compose up -d`.

## Updating to a new version

```bash
git pull
cd deploy && docker compose up -d --build
```

Only the images whose source changed are rebuilt. Because the three components are separate
images, the recommendation engine can be replaced without touching the others (SRS 3.3.8):
`docker compose up -d --build ai`.

## Without Docker

Each component can also be started directly on a server; this is the local setup of the README
with production settings:

| Component | Command | Notes |
|---|---|---|
| Database | PostgreSQL 15+ with the PostGIS extension | create a database, put its URL in `DATABASE_URL` |
| Cache | Redis 7 | put its URL in `REDIS_URL` |
| AI Server | `pip install -r requirements.txt && uvicorn app.main:app --host 127.0.0.1 --port 8000` | in `ai-engine/` |
| Application Server | `npm ci --omit=dev --omit=optional && npm run db:migrate && npm start` | in `backend/`, with `NODE_ENV=production` and `backend/.env` filled in |
| Web Server | `npm ci && npm run build && node .next/standalone/server.js` | in `frontend/`; copy `public` and `.next/static` into `.next/standalone` first; set `NEXT_PUBLIC_API_URL` before building |

Put a reverse proxy with a certificate in front, routing `/api` to port 5000 and everything else to
port 3000, as `deploy/Caddyfile` does.

## Interim deployment: Vercel

For demonstrating this phase, all three components run on Vercel, each as its own Vercel project
built from this repository, with the languages and database of the SRS unchanged: the Next.js web
client, the Node.js + Express.js Application Server, the Python + Scikit-learn AI Server, and
PostgreSQL (Neon, from the Vercel Marketplace, which offers PostGIS).

```
browser ──HTTPS──> raaah-web  (frontend/, Next.js)
   └─────HTTPS──> raaah-api  (backend/, Express as a Vercel Function) ──HTTPS──> raaah-ai (ai-engine/, FastAPI)
                        ├──> PostgreSQL (Neon)
                        └──> Redis (Upstash, optional)
```

| Vercel project | Root Directory | Entry point | Settings file |
|---|---|---|---|
| `raaah-ai` | `ai-engine` | `api/index.py` (imports `app.main:app`) | `ai-engine/vercel.json` |
| `raaah-api` | `backend` | `api/index.js` (wraps `createApp()`) | `backend/vercel.json` |
| `raaah-web` | `frontend` | Next.js (detected) | — |

`backend/api/index.js` is the serverless counterpart of `src/server.js`. A function cannot keep the
60-second timer of `startRefreshJob()` alive, so it runs the same refresh cycle (FR-03.02 automatic
check-out, crowd recalculation) before a request whenever `CROWD_REFRESH_SECONDS` have passed.

Vercel runs several instances of a function at once, and they do not share memory. So that the
system behaves the same as on one server, logged-out sessions and failed sign-ins are kept in the
database, and without Redis each instance keeps crowd levels for 10 seconds only before reading them
again. Redis (SRS 3.3.7) is still the intended cache: add it as below.
The build command of `raaah-api` is `npm run db:migrate`, so every deployment creates or updates
the tables in the connected database.

**1. AI Server** — deploy `ai-engine/` and check `https://<raaah-ai>/health`.

**2. Database** — in the `raaah-api` project, Storage → create a Neon Postgres database and connect
it; this sets `DATABASE_URL`. Add Redis the same way: Storage → Upstash for Redis (accept the
marketplace terms in the browser once), choose the region of the functions (Washington, D.C.,
`iad1`), connect it to `raaah-api` for all environments and redeploy. The integration sets `REDIS_URL`
or `KV_URL` (a `rediss://` address); the API reads either. `https://<raaah-api>/api/health` then shows `"cache":"redis"`.
Load the demonstration data once from your own machine (PowerShell):

```powershell
cd backend
vercel env pull .env.production.local     # or copy DATABASE_URL from the Vercel dashboard
$env:DATABASE_URL = "<connection string>"
npm run db:migrate
npm run db:seed
```

**3. Application Server** — environment variables of `raaah-api`:

| Setting | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | set by the Neon integration |
| `AI_ENGINE_URL` | `https://<raaah-ai>`, without a trailing slash |
| `JWT_SECRET` | a long random value |
| `CORS_ORIGIN` | address of `raaah-web`, e.g. `https://raaah-web.vercel.app` (several allowed, comma separated) |
| `REDIS_URL`, `OPENWEATHER_API_KEY` | optional |

Check `https://<raaah-api>/api/health`: it must answer `"status":"ok"`.

**4. Web client** — environment variables of `raaah-web`:

| Setting | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<raaah-api>/api` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | optional |

`NEXT_PUBLIC_*` values are compiled into the site, so redeploy `raaah-web` after changing them.

Things to know for a demonstration:

- The first request after a quiet period starts the functions and takes a few seconds longer. The
  web client asks for `/api/health` as soon as a page opens, which also starts the AI engine, so
  by the time a tourist asks for alternatives both are running. Open the site once a minute before
  presenting.
- Demo check-ins close after `CHECKIN_AUTO_CLOSE_HOURS`, after which every destination shows a Low
  crowd. Refresh them shortly before presenting, from the project root:
  `$env:DATABASE_URL = "<connection string>"; npm run demo:crowd`.
- Check-in needs the device location, which browsers give only to HTTPS sites. Vercel serves
  HTTPS, so UC-06 works on a phone at the destination or with DevTools sensors.
- The AI Server has a public address on Vercel, unlike in Fig. 45 where only the Application Server
  reaches it. It only scores the data it is sent and reads no stored data.

## Status of this setup

Docker is not installed on the development machine, so the images are built and checked by
GitHub Actions on every push (job `docker` in `.github/workflows/ci.yml`): `docker compose build`,
`docker compose up --wait` until every service is healthy, the demo data loaded, and then through the
HTTPS proxy the health check (database, Redis, PostGIS and AI engine up), the home page and a
sign-in. It also checks that the API and the AI engine cannot be reached from outside, only through
the proxy.
