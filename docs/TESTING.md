# RAAAH — Testing

Covers the use cases implemented in this phase: UC-01 Register Account, UC-02 Login, UC-03 Manage Profile and Preferences,
UC-04 Explore Destinations, UC-06 Check In at Destination and UC-09 Get Alternative Destination
Recommendations. Every test is named after the flow of the expanded use case it checks (SRS Section 7).

## Levels of testing

| Level | What is tested | Tool | Where |
|---|---|---|---|
| Unit | Crowd classification (Table 11), condition analysis, weather rules, email rules | Node.js test runner | `backend/tests/unit` |
| Integration | REST API with a real PostgreSQL database, one file per use case | Node.js test runner | `backend/tests/integration` |
| Unit / API | Data preparation, destination scoring and ranking of the AI engine | pytest | `ai-engine/tests` |
| Static | Code rules of the web client | ESLint | `frontend/`, `npm run lint` |
| Build | The web client compiles for production | Next.js | `frontend/`, `npm run build` |
| System | The use cases in a real browser, with the API, AI engine, database and web client running | Playwright | `frontend/e2e`, one file per use case |
| Deployment | The images of the Deployment Diagram (Fig. 45) build, start and answer through the HTTPS proxy | Docker Compose | `.github/workflows/ci.yml`, job `docker` |

The integration tests start the Express application on a free port and send real HTTP requests, so
routing, authentication, role checks, validation, SQL and the cache are all exercised together.
External services are replaced: the AI engine by a small stand-in server, OpenWeatherMap by a mocked
`fetch`. The scoring of the real AI engine is tested separately in `ai-engine/tests`.

The system tests use nothing replaced: they click through the pages as a tourist, observer,
administrator and tourism authority would, with the real AI engine, and set the browser location to
test check-in inside and outside a destination area.

## Running the tests

```bash
# Everything, from the project root (needs PostgreSQL: `npm run db` or `npm run dev` running)
npm test                 # backend + AI engine
npm run lint             # web client
npm run build            # web client, production build

# Backend only
cd backend
npm test                 # unit + integration
npm run test:unit        # no database needed
npm run test:coverage    # with a coverage report

# AI engine only
cd ai-engine
python -m pytest -q
```

The backend tests use their own database, `raaah_test`, which is created automatically on the same
server. They refuse to run against a database whose name does not end in `_test`, so development
and production data cannot be wiped by a test run.

### System tests (browser)

They need the whole system running with fresh demo data, because they register accounts and check in.
Use a database of their own so that the development data stays as it is (PowerShell):

```powershell
npm run db                                    # PostgreSQL, in its own terminal
cd backend
$env:DATABASE_URL = "postgres://postgres:postgres@localhost:5433/raaah_e2e"   # create it once: CREATE DATABASE raaah_e2e
npm run db:reset                              # tables and demo data
node src/server.js                            # the API; keep this terminal open
# two more terminals: `npm run ai` in the project root, and `npm run build; npx next start` in frontend/
cd ..\frontend
$env:E2E_BROWSER_CHANNEL = "msedge"           # use the installed Edge; leave out to use Playwright's Chromium
npm run test:e2e
```

`E2E_BASE_URL` points the tests at another address. Do not point them at the live site: they create
test accounts and check-ins there.

GitHub Actions runs all of the above on every push (`.github/workflows/ci.yml`): the backend tests
against PostgreSQL with PostGIS, the AI engine tests, lint and build, the system tests against the
running system, and the deployment images with `docker compose`.

## Result of the last run (18 October 2026)

| Suite | Tests | Passed | Failed |
|---|---|---|---|
| Backend unit | 34 | 34 | 0 |
| Backend integration | 122 | 122 | 0 |
| AI engine | 14 | 14 | 0 |
| System tests (Edge, desktop and phone size) | 33 | 33 | 0 |
| ESLint | — | clean | — |
| Production build | — | succeeded | — |

Backend coverage: 95.0 % of lines, 91.0 % of branches. The lines not covered are the Redis client
(the tests use the in-memory cache) and the process start-up code.

Not run on the development machine: the PostGIS branch of the area check (the local database has no
PostGIS; the haversine branch was tested) and the Docker images (Docker is not installed). Both run in
CI, in the `backend` and `docker` jobs.

The six use cases were also checked by hand on the live deployment (https://raaah-web.vercel.app)
on 18 October 2026, with the same steps as the system tests.

## Defects found by the tests and fixed

| Defect | Found by | Fix |
|---|---|---|
| The duration of a visit was counted from midnight of the check-in day instead of from the check-in time (a 7-hour stay was stored as 832 minutes). | TC-06-16 | `checkinRepository.closeAndRecordVisit` |
| Two check-in requests from the same tourist at the same moment answered with a server error. | TC-06-14 | `crowdService.checkIn` now answers 409 |
| `null` coordinates were read as the point (0, 0) instead of "no location". | TC-06-08, TC-09-12 | `crowdService`, `recommendationService` |
| `%` and `_` in the search box matched every destination. | TC-04-07 | `destinationRepository.listActive` |
| On the live (serverless) deployment a token still worked after logging out on about half of the requests: the logout was kept in the memory of one instance only. | Test of the live site, TC-02-18 | Logged-out sessions are also stored in the database (`revoked_tokens`) |
| Any number of wrong passwords could be tried in a row. | Test of the live site, TC-02-20 – TC-02-23 | Sign-in is paused for 15 minutes after 5 failures (`login_failures`) |
| A check-in recorded by one serverless instance reached the others only after up to 3 minutes. | Test of the live site, TC-06-18 | Crowd levels are cached for 10 seconds there |
| The first recommendation after a quiet period took about 5 seconds (SRS 3.3.2: 3 seconds). | Test of the live site | The site wakes the API and AI engine when it opens (`warmUp`, `/api/health`) |
| "1 check-ins" on the destination page. | Browser check | `DestinationDetail` |
| "Turn on location consent" was shown to tourists who had given consent but whose browser did not share the location. | Browser check, ST-09-04 | `RecommendationResults` |
| The registration confirmation page had no way to sign out. | Browser check, ST-01-04 | `RegisterForm` |
| Phones loaded 1.4 MB photos made for wide screens. | Browser check, ST-NF-04 | `lib/imageLoader.mjs` picks the Wikimedia width that fits |
| The web client sent no security headers. | Browser check, ST-NF-01 | `next.config.mjs` (content security policy and others) |

## Traceability: use case flows to test cases

TC-… are integration tests in `backend/tests`, ST-… are system tests in `frontend/e2e`.

### UC-01 Register Account — `uc01-register.test.js`, `e2e/uc01-register.spec.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 3–6: account created, unique Tourist ID (FR-01.02), preferences stored, tourist signed in | TC-01-01 – TC-01-04, ST-01-01, ST-01-04 |
| Alt 4a: email already registered, tourist asked to sign in | TC-01-05, ST-01-03 |
| Alt 4b: missing or invalid information, fields highlighted, nothing saved | TC-01-06, TC-01-07, ST-01-02 |

### UC-02 Login — `uc02-login.test.js`, `e2e/uc02-login.spec.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 3–5: credentials verified, role identified, page and features of the role (all four roles) | TC-02-01 – TC-02-04, ST-02-01, ST-02-03 |
| Alt 4a: invalid credentials, error shown | TC-02-05 – TC-02-09, ST-02-02 |
| FR-01.03: log out, also on another server instance | TC-02-10, TC-02-11, TC-02-18, TC-02-19, ST-02-04 |
| SRS 3.3.3: hashed passwords, role enforced on the server for every request | TC-02-12 – TC-02-17 |
| SRS 3.3.3: protection against password guessing | TC-02-20 – TC-02-23 |
| SRS 3.3.5: health check reports the AI engine | TC-02-24 |

### UC-03 Manage Profile and Preferences — `uc03-profile.test.js`, `e2e/uc03-profile.spec.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–2: profile, preferences and location consent displayed | TC-03-01, TC-03-02, ST-03-01 |
| Normal flow 3–5: changes validated, saved and confirmed | TC-03-03 – TC-03-08, ST-03-02 |
| FR-01.07: location consent | TC-03-09, ST-03-02 |
| Alt 4a: invalid information, error shown, previous values kept | TC-03-10 – TC-03-12, ST-03-03 |
| Pre-condition: tourist is logged in | TC-03-13, TC-03-14 |

### UC-04 Explore Destinations — `uc04-destinations.test.js`, `e2e/uc04-explore.spec.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–2: destinations for the list and the map | TC-04-01, TC-04-02, ST-04-01, ST-04-03 |
| FR-03.04 – FR-03.06: crowd level from active check-ins, aggregated only | TC-04-03, TC-04-04 |
| Normal flow 3: search | TC-04-05, TC-04-07, ST-04-02 |
| Alt 3a: "No destinations found" | TC-04-06, ST-04-02 |
| Normal flow 4, 6: details, crowd level, risk status, verified hazards | TC-04-08, TC-04-09, TC-04-13, TC-04-14, ST-04-04, ST-04-07 |
| Alt 6a: crowded or unsafe, warning and alternatives offered | TC-04-10 – TC-04-12, ST-04-05, ST-04-06 |
| Normal flow 5: weather from OpenWeatherMap | TC-04-15, TC-04-16 |
| Alt 5a: weather service unavailable, last available weather with update time | TC-04-17, TC-04-18 |
| Pre-condition: user is logged in | TC-04-19, TC-04-20 |

### UC-06 Check In at Destination — `uc06-checkin.test.js`, `e2e/uc06-checkin.spec.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–4, 6: location checked against the destination area, check-in recorded, confirmation | TC-06-01, TC-06-03 – TC-06-05, ST-06-02 |
| Normal flow 5: active visitor count and crowd level updated | TC-06-02, TC-06-15, TC-06-18, ST-06-02 |
| Alt 2a: no location, check-in requires location | TC-06-08, ST-06-04 |
| Alt 3a: outside the destination area, rejected | TC-06-07, TC-06-03, ST-06-03 |
| Pre-condition: logged in, location consent given | TC-06-09, TC-06-13, ST-06-01 |
| One active check-in per tourist | TC-06-10, TC-06-11, TC-06-14 |
| FR-03.02: automatic closing after the configured time | TC-06-16, TC-06-17 |
| SRS 3.3.4: location not stored | TC-06-06 |

### UC-09 Get Alternative Destination Recommendations — `uc09-recommendations.test.js`, `ai-engine/tests/test_engine.py`, `e2e/uc09-recommendations.spec.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–3: preferences, visit history, location and current conditions collected | TC-09-01, TC-09-05, TC-09-08, TC-09-09 |
| Normal flow 4–5: engine scores and ranks (FR-05.03 – FR-05.05) | `test_engine.py` (14 tests) |
| Normal flow 6–7: recommendations displayed and stored, a recommended destination opened | TC-09-02 – TC-09-04, TC-09-06, TC-09-07, ST-09-01, ST-09-02, ST-09-04 |
| FR-01.07: location used only with consent | TC-09-10 – TC-09-13, ST-09-04 |
| Alt 6a: no suitable alternative, safety information of the selection shown | TC-09-14, `test_no_suitable_alternative_returns_empty_list` |
| Alt 7a / FR-05.06: continue with the original destination | TC-09-15, ST-09-03 |
| FR-04.03: visited destinations kept, new ones ranked higher | `test_visited_destinations_are_kept_but_ranked_lower` |
| SRS 3.3.5: engine unavailable | TC-09-17, TC-09-18 |
| Pre-condition: tourist is logged in | TC-09-19 |

### Non-functional requirements — `e2e/non-functional.spec.js`

| Requirement | Test cases |
|---|---|
| SRS 3.3.1: phone and desktop, no sideways scrolling | ST-NF-03 |
| SRS 3.3.2: photos sized for the screen | ST-NF-04 |
| SRS 3.3.3: security headers and content security policy | ST-NF-01, ST-NF-02, TC-02-16, TC-02-17 |

## Manual checks

What the automated tests cannot see:

| ID | Steps | Expected result |
|---|---|---|
| MC-1 | With `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set, open Destinations → Map | One marker per destination, coloured by crowd level; a marker opens the destination (FR-02.02) |
| MC-2 | Stop the AI engine, reload Alternatives | "The recommendation engine is currently unavailable…" with Try again (SRS 3.3.5) |
| MC-3 | Open the site on a real phone at a destination, allow location, Check in | Confirmation; the crowd count goes up by one |
| MC-4 | Open the site in Chrome, Edge, Firefox and Safari | Same pages and behaviour (SRS 3.3.6) |
