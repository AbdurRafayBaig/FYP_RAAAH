# RAAAH — Testing

Covers the use cases implemented in this phase: UC-02 Login, UC-03 Manage Profile and Preferences,
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
| System | The use cases in the browser, with all components running | Manual | checklist below |

The integration tests start the Express application on a free port and send real HTTP requests, so
routing, authentication, role checks, validation, SQL and the cache are all exercised together.
External services are replaced: the AI engine by a small stand-in server, OpenWeatherMap by a mocked
`fetch`. The scoring of the real AI engine is tested separately in `ai-engine/tests`.

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

The same commands run on every push in GitHub Actions (`.github/workflows/ci.yml`), there against
PostgreSQL with PostGIS.

## Result of the last run (11 October 2026)

| Suite | Tests | Passed | Failed |
|---|---|---|---|
| Backend unit | 34 | 34 | 0 |
| Backend integration | 99 | 99 | 0 |
| AI engine | 14 | 14 | 0 |
| ESLint | — | clean | — |
| Production build | — | succeeded | — |

Backend coverage: 94.1 % of lines, 90.8 % of branches. The lines not covered are the Redis client
(the tests use the in-memory cache), the process start-up code and the account-creation queries of
UC-01, which is not part of this phase.

Not run in this environment: the PostGIS branch of the area check (the local database has no
PostGIS; the haversine branch was tested) and the Docker images (Docker is not installed on the
development machine). Both run in CI and on the server.

## Defects found by the tests and fixed

| Defect | Found by | Fix |
|---|---|---|
| The duration of a visit was counted from midnight of the check-in day instead of from the check-in time (a 7-hour stay was stored as 832 minutes). | TC-06-16 | `checkinRepository.closeAndRecordVisit` |
| Two check-in requests from the same tourist at the same moment answered with a server error. | TC-06-14 | `crowdService.checkIn` now answers 409 |
| `null` coordinates were read as the point (0, 0) instead of "no location". | TC-06-08, TC-09-12 | `crowdService`, `recommendationService` |
| `%` and `_` in the search box matched every destination. | TC-04-07 | `destinationRepository.listActive` |

## Traceability: use case flows to test cases

### UC-02 Login — `backend/tests/integration/uc02-login.test.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 3–5: credentials verified, role identified (all four roles) | TC-02-01 – TC-02-04 |
| Alt 4a: invalid credentials, error shown | TC-02-05 – TC-02-09 |
| FR-01.03: log out | TC-02-10, TC-02-11 |
| SRS 3.3.3: hashed passwords, role enforced on the server for every request | TC-02-12 – TC-02-17 |

### UC-03 Manage Profile and Preferences — `uc03-profile.test.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–2: profile, preferences and location consent displayed | TC-03-01, TC-03-02 |
| Normal flow 3–5: changes validated, saved and confirmed | TC-03-03 – TC-03-08 |
| FR-01.07: location consent | TC-03-09 |
| Alt 4a: invalid information, error shown, previous values kept | TC-03-10 – TC-03-12 |
| Pre-condition: tourist is logged in | TC-03-13, TC-03-14 |

### UC-04 Explore Destinations — `uc04-destinations.test.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–2: destinations for the list and the map | TC-04-01, TC-04-02 |
| FR-03.04 – FR-03.06: crowd level from active check-ins, aggregated only | TC-04-03, TC-04-04 |
| Normal flow 3: search | TC-04-05, TC-04-07 |
| Alt 3a: "No destinations found" | TC-04-06 |
| Normal flow 4, 6: details, crowd level, risk status, verified hazards | TC-04-08, TC-04-09, TC-04-13, TC-04-14 |
| Alt 6a: crowded or unsafe, warning and alternatives offered | TC-04-10 – TC-04-12 |
| Normal flow 5: weather from OpenWeatherMap | TC-04-15, TC-04-16 |
| Alt 5a: weather service unavailable, last available weather with update time | TC-04-17, TC-04-18 |
| Pre-condition: user is logged in | TC-04-19, TC-04-20 |

### UC-06 Check In at Destination — `uc06-checkin.test.js`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–4, 6: location checked against the destination area, check-in recorded, confirmation | TC-06-01, TC-06-03 – TC-06-05 |
| Normal flow 5: active visitor count and crowd level updated | TC-06-02, TC-06-15 |
| Alt 2a: no location, check-in requires location | TC-06-08 |
| Alt 3a: outside the destination area, rejected | TC-06-07, TC-06-03 |
| Pre-condition: logged in, location consent given | TC-06-09, TC-06-13 |
| One active check-in per tourist | TC-06-10, TC-06-11, TC-06-14 |
| FR-03.02: automatic closing after the configured time | TC-06-16, TC-06-17 |
| SRS 3.3.4: location not stored | TC-06-06 |

### UC-09 Get Alternative Destination Recommendations — `uc09-recommendations.test.js`, `ai-engine/tests/test_engine.py`

| Flow / requirement | Test cases |
|---|---|
| Normal flow 1–3: preferences, visit history, location and current conditions collected | TC-09-01, TC-09-05, TC-09-08, TC-09-09 |
| Normal flow 4–5: engine scores and ranks (FR-05.03 – FR-05.05) | `test_engine.py` (14 tests) |
| Normal flow 6–7: recommendations displayed and stored, a recommended destination opened | TC-09-02 – TC-09-04, TC-09-06, TC-09-07 |
| FR-01.07: location used only with consent | TC-09-10 – TC-09-13 |
| Alt 6a: no suitable alternative, safety information of the selection shown | TC-09-14, `test_no_suitable_alternative_returns_empty_list` |
| Alt 7a / FR-05.06: continue with the original destination | TC-09-15 |
| FR-04.03: visited destinations kept, new ones ranked higher | `test_visited_destinations_are_kept_but_ranked_lower` |
| SRS 3.3.5: engine unavailable | TC-09-17, TC-09-18 |
| Pre-condition: tourist is logged in | TC-09-19 |

## System test checklist (browser)

Run with all components started (see the README) and the demo accounts (password `Raaah@2026`).
For check-in, set the browser location in DevTools → Sensors to the coordinates on the destination
page. Run `npm run seed:crowd` in `backend/` first so that crowd levels differ between destinations.

| ID | Steps | Expected result |
|---|---|---|
| ST-02-1 | Sign in as `tourist@raaah.pk` | Home page; menu shows Destinations and Alternatives, no Dashboard |
| ST-02-2 | Sign in as `admin@raaah.pk` | Dashboard opens; no Alternatives or Profile |
| ST-02-3 | Sign in with a wrong password | "Invalid email or password. Please try again."; password field cleared |
| ST-02-4 | Sign out, then open `/profile` | Sent to the sign-in page; after signing in, back on the profile |
| ST-03-1 | Open Profile | Name, email, Tourist ID, preferences and location consent shown |
| ST-03-2 | Change preferences and consent, Save | "Your profile and preferences have been saved."; values kept after reload |
| ST-03-3 | Enter a one-letter name, Save | Error under the field; after reload the previous name is still there |
| ST-04-1 | Open Destinations; switch Photos / Table / Map | All destinations in each view; map markers at the right places |
| ST-04-2 | Search "hunza", then "zzzz" | Matching destinations; then "No destinations found" |
| ST-04-3 | Open Hunza Valley | Description, attractions, culture, crowd, safety, weather with update time, road access |
| ST-04-4 | Open a High or Critical destination | Warning with reasons and a "See quieter alternatives" button |
| ST-06-1 | Profile consent off, open a destination | Check-in panel asks for consent with a link to the profile |
| ST-06-2 | Consent on, location far away, Check in | "Check-in rejected: you are about … km from …" |
| ST-06-3 | Block location permission, Check in | "Check-in requires your location…" |
| ST-06-4 | Location set to the destination, Check in | Confirmation; check-in count on the page goes up by one |
| ST-09-1 | From a crowded destination choose "See quieter alternatives" | Ranked list with match %, reasons, crowd, safety and weather |
| ST-09-2 | Choose "Go to … anyway" | Original destination page with a note that you continued |
| ST-09-3 | Open Alternatives from the menu | "Places that suit you" without a selected destination |
| ST-09-4 | Stop the AI engine, reload Alternatives | "The recommendation engine is currently unavailable…" with Try again |
| ST-NF-1 | Repeat ST-04-1 and ST-04-3 at phone width | Layout readable without sideways scrolling (SRS 3.3.1) |
