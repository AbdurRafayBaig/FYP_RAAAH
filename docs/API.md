# RAAAH — API Reference

The REST interface of the Backend API Server (`backend/`, Component Diagram Fig. 37) as used by the
web client (`frontend/lib/api.js`), plus the internal interface of the AI Recommendation Engine.

Base address: `http://localhost:5000/api` locally, `/api` behind the HTTPS proxy in production.
Request and response bodies are JSON (at most 100 kB per request).

## Authentication and roles

Sign in with `POST /api/auth/login` (or register) to receive a JWT, then send it on every protected request:

```
Authorization: Bearer <token>
```

A token lasts `JWT_EXPIRES_IN` (default `8h`). It stops working early after logout, or when the
password of the account is reset.

| Role | Value in `user.role` | Notes |
|---|---|---|
| Tourist | `tourist` | |
| Community Safety Observer | `community_safety_observer` | can also do everything a tourist can (SRS Table 20) |
| Administrator | `administrator` | |
| Tourism Authority | `tourism_authority` | |

In the tables below, **Tourist roles** means `tourist` or `community_safety_observer`. Role checks are
made on the server for every request.

## Errors

Every error has the same shape. `fields` is only present when individual form fields are invalid.

```json
{ "error": "Please correct the highlighted fields.", "fields": { "email": "Enter a valid email address." } }
```

| Status | Meaning |
|---|---|
| 400 | Invalid input, or the body is not valid JSON |
| 401 | Not signed in, session expired, logged out, or password changed since sign-in |
| 403 | Signed in, but the role (or missing location consent) does not allow this |
| 404 | Unknown route or destination |
| 409 | Conflict: email already registered, already checked in here |
| 422 | Check-in from outside the destination area |
| 429 | Too many failed sign-ins; see the `Retry-After` header (seconds) |
| 502 / 503 | The AI engine failed or is unavailable (recommendations only) |
| 500 | Unexpected server error |

## Endpoints

| Method | Path | Access | Use case |
|---|---|---|---|
| GET | `/api/health` | public | monitoring |
| POST | `/api/auth/register` | public | UC-01 |
| POST | `/api/auth/login` | public | UC-02 |
| POST | `/api/auth/forgot-password` | public | SRS 3.3.3 |
| POST | `/api/auth/reset-password` | public | SRS 3.3.3 |
| POST | `/api/auth/logout` | signed in | FR-01.03 |
| GET | `/api/auth/me` | signed in | |
| GET | `/api/interests` | public | FR-01.04 |
| GET | `/api/profile` | Tourist roles | UC-03 |
| PUT | `/api/profile` | Tourist roles | UC-03 |
| GET | `/api/profile/saved` | Tourist roles | UC-05 |
| GET | `/api/destinations` | signed in | UC-04 |
| GET | `/api/destinations/:id` | signed in | UC-04 |
| POST | `/api/destinations/:id/save` | Tourist roles | UC-05 |
| DELETE | `/api/destinations/:id/save` | Tourist roles | UC-05 |
| POST | `/api/destinations/:id/check-in` | Tourist roles | UC-06 |
| GET | `/api/check-ins/active` | Tourist roles | UC-06 |
| POST | `/api/recommendations` | Tourist roles | UC-09 |

### Health

`GET /api/health` → `200`

```json
{ "status": "ok", "database": "up", "cache": "redis", "postgis": true, "aiEngine": "up" }
```

Answers `503` with `"status": "unavailable"` when the database cannot be reached. The API stays `ok`
when only the AI engine is down. See [MAINTENANCE.md](MAINTENANCE.md).

### Account

**`POST /api/auth/register`** (UC-01)

```json
{
  "fullName": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "<password>",
  "confirmPassword": "<password>",
  "interests": ["Nature", "Photography"]
}
```

- `fullName`: 2–100 letters; spaces, dots, apostrophes and hyphens allowed.
- `password`: at least 8 characters with a letter and a number, at most 72 bytes.
- `interests`: optional, from `GET /api/interests`.

`201` → `{ "token", "user", "message" }`. The message includes the new Tourist ID (`RAH-<year>-<000123>`).
`400` with `fields` when input is invalid; `409` when the email is already registered.

**`POST /api/auth/login`** (UC-02)

```json
{ "email": "<email>", "password": "<password>" }
```

`200` → `{ "token", "user" }` (the demo accounts are listed in the README). `401` for a wrong email or password. After `LOGIN_MAX_FAILURES` (5)
failures from one address within `LOGIN_LOCK_MINUTES` (15), sign-in for that email answers `429`.

**`POST /api/auth/forgot-password`** — `{ "email" }` → `200 { "message" }`

The answer is the same whether or not an account exists. At most 3 reset emails per account per
hour. The link is valid once, for `PASSWORD_RESET_MINUTES` (30).

**`POST /api/auth/reset-password`** — `{ "token", "password", "confirmPassword" }` → `200 { "message" }`

The password rule is the same as for registration. `400` when the link is invalid, used or expired.
All earlier sessions of the account end.

**`POST /api/auth/logout`** → `200 { "message" }`. The token is revoked until it would have expired.

**`GET /api/auth/me`** → `200 { "user" }`

The `user` object returned by the account endpoints:

```json
{
  "userId": 1,
  "fullName": "Demo Tourist",
  "email": "tourist@raaah.pk",
  "role": "tourist",
  "touristCode": "RAH-2026-000001",
  "locationConsent": false,
  "interests": ["Nature"],
  "createdAt": "2026-10-11T09:00:00.000Z"
}
```

### Profile (UC-03)

**`GET /api/interests`** → `{ "interests": [...] }`. The travel preferences are Nature, Historical
Sites, Adventure, Culture and Photography.

**`GET /api/profile`** → `{ "profile": <user> }`

**`PUT /api/profile`**

```json
{ "fullName": "Ayesha Khan", "email": "ayesha@example.com", "interests": ["Nature"], "locationConsent": true }
```

All four fields are required. `200` → `{ "profile", "message" }`. On `400` nothing is changed, and
`fields` names what to correct (including an email used by another account).

**`GET /api/profile/saved`** → `{ "destinations": [<destination summary> + "savedAt"] }`

### Destinations (UC-04, UC-05)

**`GET /api/destinations?search=hunza`** → `{ "destinations": [...], "message"? }`

`search` is optional (at most 100 characters). When nothing matches, the list is empty and
`message` is `"No destinations found"`. Each destination summary has:

`destinationId`, `name`, `region`, `description`, `location` (`latitude`, `longitude`), `imageUrl`,
`altitudeM`, `interests`, `riskStatus` (`Low Risk` | `Elevated Risk` | `High Risk`), `accessInfo`
(`status`: `Open` | `Limited` | `Closed`), `accommodationAvailable`, `crowd` (`crowdLevel`,
`activeVisitors`, `capacityThreshold`) and `weather`.

Crowd levels (Table 11) come from active visitors ÷ capacity threshold: **Low** below 0.6,
**Moderate** below 1.0, **High** up to 1.2, **Critical** above 1.2.

**`GET /api/destinations/:id`** → `{ "destination" }`

The summary plus `attractions`, `activities`, `gallery`, `bestSeason`, `areaRadiusM`, `forecast`,
`saved`, `culturalInfo`, verified `hazards`, `advisory` (a warning when conditions are poor),
`preferenceMatch` and `checkInStatus` (`checkedInHere`, `activeCheckIn`, `locationConsent`).
`404` for an unknown or inactive id.

**`POST /api/destinations/:id/save`** → `201 { "saved": true, "alreadySaved": false, "message" }`,
or `200` with `"alreadySaved": true` when it was already saved.

**`DELETE /api/destinations/:id/save`** → `200 { "saved": false, "message" }`

### Check-in (UC-06)

**`POST /api/destinations/:id/check-in`**

```json
{ "latitude": 36.3167, "longitude": 74.65 }
```

`201` → `{ "message", "checkIn", "crowd", "closedPrevious" }`

| Status | When |
|---|---|
| 400 | latitude/longitude missing or out of range |
| 403 | location consent is off in the profile |
| 404 | destination not found |
| 409 | already checked in at this destination |
| 422 | outside the destination area (the message gives the distance and allowed radius) |

A tourist can be checked in at one destination at a time. A check-in elsewhere is closed and recorded
as a visit (`closedPrevious`). Check-ins close automatically after `CHECKIN_AUTO_CLOSE_HOURS` (6).

**`GET /api/check-ins/active`** → `{ "checkIn": null | { "checkinId", "destinationId", "destinationName", "checkinTime", "checkoutTime", "status" } }`

### Recommendations (UC-09)

**`POST /api/recommendations`**

```json
{ "sourceDestinationId": 3, "latitude": 33.68, "longitude": 73.05 }
```

All fields are optional. The location is only used when the tourist has given location consent.

`200` →

```json
{
  "source": { "...destination summary...": "", "hazards": [], "advisory": {}, "preferenceMatch": {} },
  "recommendations": [
    { "rank": 1, "score": 0.83, "reasons": ["Good for nature", "Quieter than your pick"],
      "factors": { "preference": 1, "crowd": 1, "safety": 1 }, "previouslyVisited": false,
      "destination": { "...destination summary...": "" } }
  ],
  "noSuitableAlternative": false,
  "usedLocation": true,
  "engine": { "approach": "content-based", "version": "1.0.0" }
}
```

At most 5 recommendations. When none is suitable, the list is empty, `noSuitableAlternative` is
`true` and `message` asks the tourist to review the safety information (UC-09 alt 6a). `404` for an
unknown `sourceDestinationId`. `503` / `502` when the AI engine is unavailable or fails.

## AI Recommendation Engine (internal)

Called only by the backend (`backend/src/integrations/aiEngineClient.js`, `AI_ENGINE_URL`). It is
not reachable from outside in the Docker deployment (Fig. 45).

| Method | Path | |
|---|---|---|
| GET | `/health` | status and the approach used |
| POST | `/recommendations/score` | scores and ranks destinations |

`POST /recommendations/score` takes the tourist (`interests`, `visitCounts`, optional `location`), an
optional `sourceDestinationId`, a `limit` (1–20, default 5) and the candidate `destinations` with
their crowd level, risk status, access status, weather and accommodation. It returns
`{ "recommendations", "excluded", "engine" }`. The models are in `ai-engine/app/schemas.py`, and the
scoring weights are in `ai-engine/app/scoring.py`.
