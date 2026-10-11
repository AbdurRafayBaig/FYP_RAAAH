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

## Interim deployment: web client on Vercel

For demonstrating this phase, the web client can be hosted on Vercel. Vercel runs only the Web
Server node of Fig. 45. The Application Server, the AI Server and the database are separate
programs that stay running, so they need a host of their own; without them the deployed site opens
but nobody can log in, because every use case of this phase goes through the API.

```
browser ──HTTPS──> Vercel (frontend/)
   └─────HTTPS──> Application Server (backend/) ──> AI Server (ai-engine/)
                          └──> PostgreSQL
```

**1. Database** — create a PostgreSQL database with a hosted provider (for example Neon, which has
a free plan and PostGIS) and copy its connection string. Create the tables and demo data once from
your own machine (PowerShell):

```powershell
cd backend
$env:DATABASE_URL = "<connection string>"
npm run db:migrate
npm run db:seed
```

**2. AI Server** — a Python web service (for example on Render or Railway):

| Setting | Value |
|---|---|
| Root directory | `ai-engine` |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

**3. Application Server** — a Node.js web service on the same provider:

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm ci --omit=optional` |
| Start command | `npm run db:migrate && npm start` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | the connection string of step 1 |
| `AI_ENGINE_URL` | address of the AI Server of step 2, without a trailing slash |
| `JWT_SECRET` | a long random value |
| `CORS_ORIGIN` | address of the Vercel site, e.g. `https://raaah.vercel.app` (several allowed, comma separated) |
| `OPENWEATHER_API_KEY` | optional |

Check `https://<application server>/api/health`: it must answer `"status":"ok"`.

**4. Web client on Vercel** — import the GitHub repository and set:

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Next.js (detected) |
| `NEXT_PUBLIC_API_URL` | `https://<application server>/api` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | optional |

`NEXT_PUBLIC_*` values are compiled into the site, so redeploy on Vercel after changing them.

Things to know for a demonstration:

- Free plans put an idle service to sleep. The first request after a pause can take up to a
  minute; open the site a few minutes before presenting.
- Without `REDIS_URL` the Application Server keeps crowd levels and logged-out sessions in memory.
  That is fine for one server instance; add a hosted Redis when there is more than one.
- Demo check-ins close after `CHECKIN_AUTO_CLOSE_HOURS`. Refresh them with `npm run seed:crowd`
  (with `DATABASE_URL` set as in step 1) before presenting.
- Check-in needs the device location, which browsers give only to HTTPS sites. Vercel and the
  hosts above serve HTTPS, so UC-06 works on a phone at the destination or with DevTools sensors.

This interim setup has not been deployed from the development machine; the settings above are the
ones the code expects (`backend/src/config.js`, `frontend/lib/api.js`).

## Status of this setup

The three images, the compose file and the proxy configuration were written against the diagram
but have not been built or started yet: Docker is not installed on the development machine. What
has been verified locally is everything they run — the production build of the web client and its
standalone server, the Application Server with its test suite, and the AI engine with its tests.
The first `docker compose up --build` on a machine with Docker is therefore the remaining check.
