<div align="center">

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- NASA MISSION CONTROL — README                                          -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

```
███╗   ██╗ █████╗ ███████╗ █████╗     ███╗   ███╗██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗
████╗  ██║██╔══██╗██╔════╝██╔══██╗    ████╗ ████║██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║
██╔██╗ ██║███████║███████╗███████║    ██╔████╔██║██║███████╗███████╗██║██║   ██║██╔██╗ ██║
██║╚██╗██║██╔══██║╚════██║██╔══██║    ██║╚██╔╝██║██║╚════██║╚════██║██║██║   ██║██║╚██╗██║
██║ ╚████║██║  ██║███████║██║  ██║    ██║ ╚═╝ ██║██║███████║███████║██║╚██████╔╝██║ ╚████║
╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ██║     ██║╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                                       ██║     ██║
                                  ██████╔╝██████╔╝
                                  ╚═════╝ ╚═════╝
                  C O N T R O L
```

### 🛸 *A production-grade NASA data platform — built from the void, engineered for the cosmos.*

<br/>

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.19-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Groq](https://img.shields.io/badge/Groq-LLM_Inference-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Llama 3](https://img.shields.io/badge/Meta_Llama_3-70B_Versatile-0467DF?style=for-the-badge&logo=meta&logoColor=white)](https://llama.meta.com/)

<br/>

> **⚡ Live on Vercel · Full-stack monorepo · AI-powered · Real NASA data · Zero-config deploy**

</div>

---

## 🌌 Table of Contents

- [🚀 Overview](#-overview)
- [✨ Feature Showcase](#-feature-showcase)
  - [🔀 APOD ⟷ NeoWS Selection Toggle](#-apod--neows-selection-toggle)
  - [🖼️ APOD — Astronomy Picture of the Day Viewer](#️-apod--astronomy-picture-of-the-day-viewer)
  - [🤖 AI Mission Briefing — Llama 3 via Groq](#-ai-mission-briefing--llama-3-via-groq)
  - [🗓️ Advanced Data Selector — Day / Month / Year Modes](#️-advanced-data-selector--day--month--year-modes)
  - [☄️ NeoWS — Near-Earth Object Asteroid Tracker](#️-neows--near-earth-object-asteroid-tracker)
  - [🌠 Animated Space Background](#-animated-space-background)
- [🏗️ Architecture & Project Structure](#️-architecture--project-structure)
- [⚙️ Tech Stack](#️-tech-stack)
- [🔌 API Reference](#-api-reference)
- [🛡️ Security & Rate Limiting](#️-security--rate-limiting)
- [🔑 Environment Variables](#-environment-variables)
- [🧪 Testing](#-testing)
- [🚢 Deployment — Vercel](#-deployment--vercel)
- [🛠️ Local Development](#️-local-development)
- [📸 Screenshots](#-screenshots)
- [🗺️ Roadmap](#️-roadmap)

---

## 🚀 Overview

**NASA Mission Control** is a production-grade, full-stack web application that surfaces live NASA data through two flagship modules — the **Astronomy Picture of the Day (APOD)** and the **Near-Earth Object Web Service (NeoWS)** — all wrapped in a stunning animated cosmic UI with an integrated **AI Mission Briefing engine** powered by **Meta Llama 3.3-70B** via **Groq's ultra-fast inference API**.

This is not a tutorial project. Every engineering decision — from the Vercel monorepo wiring, the Express security middleware stack, the abort-safe React hooks, to the physics-based CSS canvas animations — reflects real-world, senior-level craftsmanship. Data flows from NASA's official APIs through a hardened Express backend, gets normalised and typed end-to-end in TypeScript, and renders in a glass-morphism React UI with Framer Motion animations.

```
┌──────────────────────────────────────────────────────────┐
│                  NASA MISSION CONTROL                     │
│         Full-Stack Monorepo · Vercel Edge Deploy          │
│                                                          │
│  ╔══════════════╗    ╔══════════════════════════════╗    │
│  ║   FRONTEND   ║    ║        BACKEND (API)          ║    │
│  ║  React 18   ║◄──►║     Express + TypeScript      ║    │
│  ║  TypeScript  ║    ║  /api/apod  /api/ai  /neows  ║    │
│  ║  Vite 8      ║    ╚══════════════════════════════╝    │
│  ║  Framer      ║            │          │                 │
│  ║  Motion      ║            ▼          ▼                 │
│  ╚══════════════╝    ┌─────────┐  ┌─────────┐           │
│                      │   NASA  │  │  Groq   │           │
│                      │  APIs   │  │ Llama 3 │           │
│                      └─────────┘  └─────────┘           │
└──────────────────────────────────────────────────────────┘
```

---

## ✨ Feature Showcase

---

### 🔀 APOD ⟷ NeoWS Selection Toggle

The navigation bar at the top of the application exposes a **seamless toggle between the two flagship NASA data modules** — `APOD` (Astronomy Picture of the Day) and `NeoWs` (Near-Earth Objects). This is not a page reload; it is a **client-side hash-based router** that swaps components in memory with animated transitions.

**How it works under the hood:**

- The `Header` component renders `NAV_ITEMS` — a statically typed array of `{ label, sub, hash }` — as pill-style navigation buttons.
- Active route is tracked via `window.location.hash` and React state in `App.tsx` (`currentRoute`).
- `onNavigate()` updates the hash and triggers a re-render, swapping between `<APODViewer>` (with its `<DateSelector>` sidebar) and `<NeoWs>` — with a smooth `opacity` animated mount via `motion.div`.
- A **pulsing green dot** (CSS `@keyframes header-pulse`) acts as the real-time "live data" signal, reinforcing that the data feed is always active.

```typescript
const NAV_ITEMS = [
  { label: 'APOD',  sub: 'Picture of the Day', hash: '#/'      },
  { label: 'NeoWs', sub: 'Near-Earth Objects',  hash: '#/neows' },
];
```

| State | Rendered Panel |
|---|---|
| `currentRoute === '/'` | `<DateSelector>` sidebar + `<APODViewer>` + `<MissionBriefing>` |
| `currentRoute === '/neows'` | Full-width `<NeoWs>` asteroid tracker |

---

### 🖼️ APOD — Astronomy Picture of the Day Viewer

The **APOD module** fetches the official NASA Astronomy Picture of the Day, rendering either a **full-resolution image** or an **embedded video iframe** depending on `media_type` returned by NASA's API.

**Key engineering details:**

- `useAPOD(selectedDate)` — a custom React hook that fires `GET /api/apod?date=YYYY-MM-DD`, manages loading/error state, and returns a fully-typed `APODResponse`.
- Supports both `media_type: 'image'` and `media_type: 'video'` — the viewer conditionally renders an `<img>` or an `<iframe>` based on the API response.
- **HD Badge** is rendered when `hdurl` is present; the "View Full Image" button opens the raw NASA HD URL in a new tab.
- **Share button** copies a deep-linked URL to the clipboard and dispatches a `show-toast` `CustomEvent` for global notification.
- `AbortController` is used inside the APOD hook to cancel in-flight requests when the selected date changes — no stale state, no race conditions.
- Error states are surfaced as animated toast notifications, not silent failures.

```
┌─────────────────────────────────────────────────┐
│   APOD VIEWER COMPONENT FLOW                    │
│                                                 │
│   useAPOD(date) → GET /api/apod?date=…          │
│       │                                         │
│       ├── media_type: 'image' → <img> + HD link │
│       ├── media_type: 'video' → <iframe>        │
│       └── error → Toast notification            │
│                                                 │
│   [Generate AI Mission Briefing] ──►  useBriefing│
│   [View Full Image]              ──►  hdurl link │
│   [Share / Copy Link]            ──►  Clipboard  │
└─────────────────────────────────────────────────┘
```

---

### 🤖 AI Mission Briefing — Llama 3 via Groq

This is the crown jewel feature. When a user presses **"Generate AI Mission Briefing"**, the app dispatches the current APOD's `title`, `date`, `explanation`, and `mediaType` to the backend's `/api/ai/briefing` endpoint. The backend forwards this to **Groq's OpenAI-compatible completions API** using **Meta's `llama-3.3-70b-versatile` model** at temperature `0.7`.

**The system is prompted to act as a NASA Mission Control AI analyst**, generating a structured Markdown briefing with these six sections:

| # | Section | Purpose |
|---|---|---|
| 1 | 🌍 Mission Overview | High-level mission summary |
| 2 | 📊 Key Data Points | Quantified astronomical facts |
| 3 | 🔬 Scientific Significance | Why this phenomenon matters |
| 4 | 🌡️ Environmental Assessment | Cosmic environment analysis |
| 5 | ⚠️ Risk & Strategic Assessment | Hazards and strategic context |
| 6 | 🎯 Final Mission Directive | Actionable scientific directive |

**Backend route — `POST /api/ai/briefing`:**

```typescript
const GROQ_MODEL  = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System prompt gives Llama 3 its persona
const SYSTEM_PROMPT =
  'You are a NASA Mission Control AI analyst. Generate structured mission ' +
  'briefings in markdown. Be scientific, precise, and engaging. Use relevant ' +
  'emojis for section headers.';
```

**Frontend hook — `useBriefing(apod)`:**

- Uses `AbortController` to cancel any in-flight Groq request when APOD changes.
- Briefing state resets automatically when `apod.date` changes (via `useEffect` dep on `apod?.date`).
- Rendered inside `<MissionBriefing>` which **typewriter-reveals** the markdown content character-by-character using a `revealed` state, giving the experience of live AI generation.
- A `Regenerate` button and timestamp (`Generated at HH:MM:SS`) are shown in the footer of the briefing card.
- If `GROQ_API_KEY` is missing, the endpoint gracefully returns HTTP 503 with a human-readable message.

**Error handling cascade:**
```
Groq 401/403 → 503 "Auth failed. Check GROQ_API_KEY."
Groq empty → 502 "AI returned empty response."
No API Key → 503 "AI service not configured."
```

---

### 🗓️ Advanced Data Selector — Day / Month / Year Modes

The **DateSelector** is one of the most sophisticated UI components in the project. Located in the left sidebar (APOD mode only), it offers **three animated tab modes** for exploring NASA's APOD archive, which stretches back to **June 16, 1995**.

#### 🗃️ Three Selection Modes:

**① Day Mode — Horizontal Scrollable Strip**
- Renders a ±15-day strip centered on the currently selected date (31 day cards total).
- Navigation arrows shift the window ±7 days at a time.
- Cards show weekday abbreviation + date number + a teal dot for today.
- Auto-scrolls the selected card to the center of the viewport using `scrollTo({ behavior: 'smooth' })`.
- Dates before `1995-06-16` and future dates are visually dimmed and pointer-blocked.

**② Month Mode — Monthly Grid with Year Navigator**
- Renders a 4×3 grid of month abbreviations (Jan–Dec).
- A year navigator (← / →) lets users step through years from 1995 to present.
- Months before June 1995 or in the future are disabled (opacity + `not-allowed` cursor).
- Selecting a past month jumps to the 1st of that month; selecting the current month resolves to today.

**③ Year Mode — Staggered Year Grid**
- Renders all years from 1995 to current year in rows of 5.
- Each year card has a staggered entrance animation (`delay: index * 0.022s`).
- Selecting a past year resolves to January 1st; selecting the current year resolves to today.

**Tab switching** uses Framer Motion's `AnimatePresence` with `layoutId="date-tab-indicator"` for a shared-layout spring animation on the active pill indicator, and slide-in/slide-out transitions (`y: ±18px`) between mode panels.

```typescript
const TAB_ORDER: DateMode[] = ['day', 'month', 'year'];

// Slide direction is determined by tab order position
function slideDir(from: DateMode, to: DateMode): number {
  return TAB_ORDER.indexOf(to) > TAB_ORDER.indexOf(from) ? 1 : -1;
}
```

**Date constraint system:**
```
MIN_DATE: 1995-06-16  (first APOD ever)
MAX_DATE: today (local midnight, no UTC shift)
Parsing:  parseLocal('YYYY-MM-DD') → avoids timezone-off-by-one
```

---

### ☄️ NeoWS — Near-Earth Object Asteroid Tracker

The **NeoWS module** is a full-featured asteroid tracking dashboard powered by NASA's Near Earth Object Web Service and JPL Small Body Database. It surfaces real-time close-approach data for asteroids and comets passing within 1.3 AU of the Sun.

**Feature breakdown:**

#### 📅 Date Range Selector
- `From` / `To` native `<input type="date">` fields, validated against a **7-day maximum window** (enforced both by the UI and the NASA API).
- Inline error message when the range exceeds 7 days — no modal, no alert, just contextual red text.
- A `Search` button fires `useNeoFeed(start, end)` which calls `GET /api/neows/feed?start_date=…&end_date=…`.

#### 📊 Live Stats Bar (3 Stat Cards)
| Stat Card | Source |
|---|---|
| **Total Asteroids** | `asteroids.length` |
| **Potentially Hazardous** | `filter(a => a.isPotentiallyHazardous).length` |
| **Closest Approach** | `Math.min(...missDistanceLunar).toFixed(2) + " LD"` |

#### 🗂️ Sortable Asteroid Data Table

Full 6-column data table with **client-side tri-state sorting** (ascending → descending → reset):

| Column | Data | Sortable |
|---|---|---|
| Name | Cleaned (`replace(/[()]/g, '')`) | ✗ |
| Closest Approach | `YYYY-MM-DD` | ✗ |
| Miss Distance (LD) | Lunar Distance, color-coded | ✓ |
| Velocity | km/h formatted | ✓ |
| Diameter (km) | `min – max km` | ✓ |
| Status | `HAZARDOUS` / `SAFE` badge | ✗ |

**Miss Distance color coding:**
```
< 5 LD   → 🔴 Red    (imminent proximity)
5–20 LD  → 🟡 Yellow (watch zone)
> 20 LD  → 🟢 Green  (safe distance)
```

**Skeleton loading state**: 6 animated skeleton rows appear while the API call is in flight — no layout shift, no spinner-only UX.

**Data normalisation** strips raw NASA API shapes into clean `NeoWsAsteroid` objects:
```typescript
interface NeoWsAsteroid {
  id, name, date, isPotentiallyHazardous,
  estimatedDiameterMinKm, estimatedDiameterMaxKm,
  closestApproachDate, missDistanceKm, missDistanceLunar,
  relativeVelocityKmh, absoluteMagnitude
}
```

---

### 🌠 Animated Space Background

The `<SpaceBackground>` component renders a full-viewport `<canvas>` element with **three layered animation systems**, all driven by a single `requestAnimationFrame` loop:

| Layer | Technique | Effect |
|---|---|---|
| ⭐ Stars | 200 particles with independent twinkle phase/speed | Parallax follows mouse position |
| 🌫️ Nebulae | Radial gradient blobs with `globalCompositeOperation: 'screen'` | Pulsing opacity, slow drift |
| 💫 Shooting Stars | State-machine: `fadein → travel → fadeout` | Random interval, trails via `ctx.shadowBlur` |

Mouse parallax is tracked via `mousemove` listener on `window`, stored in a `useRef` (no re-renders). Canvas resizes responsively via a `ResizeObserver`. Full cleanup on unmount (cancels `requestAnimationFrame`, removes listeners).

---

## 🏗️ Architecture & Project Structure

```
nasa-mission-control/                   ← Vercel monorepo root
│
├── 📄 vercel.json                       ← Routing: /api/* → serverless fn, /* → SPA
├── 📄 package.json                      ← Root scripts (dev, build, install:all)
├── 📄 .env.vercel.example               ← Environment variable template
│
├── 📁 api/
│   └── index.ts                         ← Vercel Serverless Function entry point
│                                          (Express app wrapped in Vercel handler)
│
├── 📁 backend/
│   ├── src/
│   │   ├── index.ts                     ← Express app (standalone local dev)
│   │   └── routes/
│   │       ├── apod.ts                  ← GET /api/apod, GET /api/apod/range
│   │       ├── ai.ts                    ← POST /api/ai/briefing (Groq/Llama 3)
│   │       └── neows.ts                 ← GET /api/neows/feed, /neo/:id, /neo/browse
│   └── package.json
│
└── 📁 frontend/
    ├── src/
    │   ├── App.tsx                      ← Root: router, layout, global state
    │   ├── api/
    │   │   ├── apodApi.ts               ← fetchAPOD, fetchAPODRange, generateBriefing
    │   │   ├── neowsApi.ts              ← fetchNeoFeed, fetchNeoLookup, fetchNeoBrowse
    │   │   └── index.ts                 ← Re-export barrel
    │   ├── components/
    │   │   ├── Header/                  ← Top nav: brand + APOD/NeoWS toggle
    │   │   ├── SpaceBackground/         ← Canvas: stars, nebulae, shooting stars
    │   │   ├── DateSelector/            ← Day/Month/Year animated date picker
    │   │   ├── APODViewer/              ← Image/video renderer + action buttons
    │   │   ├── MissionBriefing/         ← Typewriter AI briefing card
    │   │   └── NeoWs/                   ← Asteroid tracker dashboard
    │   ├── hooks/
    │   │   ├── useAPOD.ts               ← APOD fetch hook (abort-safe)
    │   │   ├── useBriefing.ts           ← Groq AI briefing hook (abort-safe)
    │   │   └── useNeoFeed.ts            ← NeoWS feed hook
    │   ├── types/
    │   │   ├── apod.ts                  ← APODResponse, DateMode, AppError
    │   │   └── neows.ts                 ← NeoWsAsteroid, NeoWsFeedResponse, …
    │   └── __tests__/                   ← Vitest + React Testing Library
    └── package.json
```

**Monorepo routing strategy (vercel.json):**
```json
{ "src": "/api/(.*)",  "dest": "/api/index.ts" },   ← Serverless function
{ "src": "/assets/(.*)", "dest": "/assets/$1"  },   ← Static assets
{ "src": "^/[^.]*$",  "dest": "/index.html"   }    ← SPA fallback
```

---

## ⚙️ Tech Stack

### 🎨 Frontend

| Technology | Version | Role |
|---|---|---|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square) **React** | 18.3.1 | UI component framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) **TypeScript** | 5.3.2 | End-to-end type safety |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square) **Vite** | 8.0 | Lightning-fast build tool |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white&style=flat-square) **Framer Motion** | latest | Physics-based animations |
| ![Lucide](https://img.shields.io/badge/-Lucide_React-F56565?logo=feather&logoColor=white&style=flat-square) **Lucide React** | 5.6.0 | Icon system |
| **React Icons** | 5.6.0 | Extended icon set |
| **Canvas API** | native | SpaceBackground animation engine |

### 🖥️ Backend

| Technology | Version | Role |
|---|---|---|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) **Node.js** | ≥20.19.0 | Runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat-square) **Express** | 4.18.2 | HTTP server & routing |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) **TypeScript** | 5.3.2 | Typed routes & handlers |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white&style=flat-square) **Axios** | 1.6.0 | HTTP client for NASA/Groq APIs |
| **Helmet** | 7.1.0 | HTTP security headers |
| **CORS** | 2.8.5 | Origin whitelisting |
| **express-rate-limit** | 7.1.5 | 100 req/15min rate limiter |
| **dotenv** | 16.3.1 | Environment variable loading |

### 🤖 AI / LLM

| Technology | Role |
|---|---|
| ![Groq](https://img.shields.io/badge/-Groq-F55036?logo=groq&logoColor=white&style=flat-square) **Groq Cloud** | Ultra-fast LLM inference API |
| ![Meta](https://img.shields.io/badge/-Meta_Llama_3.3_70B-0467DF?logo=meta&logoColor=white&style=flat-square) **llama-3.3-70b-versatile** | Generative model for mission briefings |

### 🚀 Infrastructure

| Technology | Role |
|---|---|
| ![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white&style=flat-square) **Vercel** | Monorepo hosting, serverless functions, CDN |
| ![NASA](https://img.shields.io/badge/-NASA_API-FC3D21?logo=nasa&logoColor=white&style=flat-square) **NASA Open APIs** | APOD + NeoWS data source |

### 🧪 Testing

| Technology | Role |
|---|---|
| ![Vitest](https://img.shields.io/badge/-Vitest-6E9F18?logo=vitest&logoColor=white&style=flat-square) **Vitest** | Frontend unit test runner |
| **React Testing Library** | Component rendering & DOM assertions |
| **Jest** | Backend unit & integration tests |
| **Supertest** | HTTP endpoint testing |
| **ts-jest** | TypeScript-aware Jest transformer |

---

## 🔌 API Reference

All endpoints are mounted at `/api` and served by the Express serverless function.

### 📸 APOD Endpoints

#### `GET /api/apod`
Fetch the Astronomy Picture of the Day.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `date` | `string` | today | `YYYY-MM-DD` format. Range: `1995-06-16` to today |

**Response:**
```json
{
  "date": "2024-03-15",
  "title": "The Horsehead Nebula",
  "explanation": "...",
  "url": "https://apod.nasa.gov/...",
  "hdurl": "https://apod.nasa.gov/...",
  "media_type": "image",
  "copyright": "..."
}
```

#### `GET /api/apod/range`
Fetch multiple APODs for a date range.

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `string` | Range start (`YYYY-MM-DD`) |
| `end_date` | `string` | Range end (`YYYY-MM-DD`) |

---

### 🤖 AI Briefing Endpoint

#### `POST /api/ai/briefing`
Generate a structured AI mission briefing via Llama 3.3-70B on Groq.

**Request body:**
```json
{
  "title": "The Pillars of Creation",
  "date": "2024-01-15",
  "explanation": "Eagle Nebula star-forming region...",
  "mediaType": "image"
}
```

**Response:**
```json
{
  "briefing": "## 🌍 Mission Overview\n\n..."
}
```

**Error responses:**
| Status | Condition |
|---|---|
| `400` | Missing `title`, `date`, or `explanation` |
| `503` | `GROQ_API_KEY` not set |
| `503` | Groq authentication failed (401/403) |
| `502` | Groq returned empty response |

---

### ☄️ NeoWS Endpoints

#### `GET /api/neows/feed`
Fetch near-Earth objects for a date range (max 7 days).

| Parameter | Type | Description |
|---|---|---|
| `start_date` | `string` | Feed start (`YYYY-MM-DD`) |
| `end_date` | `string` | Feed end (`YYYY-MM-DD`, max +7 days) |

**Response:** Array of normalised `NeoWsAsteroid` objects sorted by closest approach date.

#### `GET /api/neows/neo/:id`
Lookup a specific asteroid by its NASA NeoWS ID.

#### `GET /api/neows/neo/browse`
Browse all catalogued near-Earth objects (paginated).

| Parameter | Type | Default |
|---|---|---|
| `page` | `number` | `0` |

---

### 🏥 Health Check

#### `GET /`
```json
{ "status": "ok", "service": "NASA Mission Control API", "env": "production" }
```

---

## 🛡️ Security & Rate Limiting

The backend enforces a layered security posture:

```
Request
  │
  ▼
┌─────────────────────────────┐
│  CORS Whitelist             │  Only CORS_ORIGIN env var origins allowed
│  (origin allowlist check)   │  Credentials: true
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│  Helmet                     │  Sets: X-Frame-Options, X-Content-Type,
│  (HTTP security headers)    │  Referrer-Policy, HSTS, etc.
│  contentSecurityPolicy:off  │  (disabled for Vercel CDN compat)
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│  Rate Limiter               │  100 requests per 15-minute window
│  (express-rate-limit)       │  Standard headers (RateLimit-*)
│  trust proxy: 1             │  Vercel-aware IP detection
└─────────────┬───────────────┘
              ▼
           Routes
```

**Rate limit response (429):**
```json
{ "error": true, "message": "Too many requests, please try again later." }
```

---

## 🔑 Environment Variables

Copy `.env.vercel.example` and configure. **Never commit actual secrets.**

### Backend (Serverless Function)

| Variable | Required | Description |
|---|---|---|
| `NASA_API_KEY` | ✅ Recommended | NASA API key from [api.nasa.gov](https://api.nasa.gov). Falls back to `DEMO_KEY` (severely rate-limited). |
| `GROQ_API_KEY` | ✅ Required for AI | Groq Cloud API key from [console.groq.com](https://console.groq.com). Without this, AI Briefing returns 503. |
| `CORS_ORIGIN` | ✅ Required | Comma-separated list of allowed frontend origins. Example: `https://your-project.vercel.app` |

### Frontend (Vite Build)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ Required | Backend API URL. Set to `/api` on Vercel (same-origin). Use `http://localhost:3001` locally. |

### Runtime

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `production` | Controls error stack trace exposure in error handler |

```bash
# .env (local dev)
NASA_API_KEY=your_key_here
GROQ_API_KEY=your_groq_key_here
CORS_ORIGIN=http://localhost:3000
VITE_API_URL=http://localhost:3001
NODE_ENV=development
```

---

## 🧪 Testing

### Frontend Tests (Vitest + RTL)

```bash
cd frontend
npm run test
```

**Test coverage includes:**

- `APODViewer.test.tsx` — Renders image vs video, HD badge, "Generate AI Mission Briefing" button, "Analyzing..." loading state, null APOD guard
- `DateSelector.test.tsx` — All three tab labels render, `onModeChange` called correctly, active tab no-op, pre-epoch dates disabled, future dates disabled, month grid renders, year grid renders with 1995

### Backend Tests (Jest + Supertest)

```bash
cd backend
npm test
```

Tests cover Express route handlers, error responses, and API proxy behaviour.

---

## 🚢 Deployment — Vercel

This project is architected as a **Vercel monorepo** with zero additional configuration needed beyond environment variables.

### One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/)

### Manual Setup

**Step 1 — Import repository**
```
Vercel Dashboard → Add New Project → Import Git Repository
```

**Step 2 — Configure Build**
```
Build Command:    npm install && cd frontend && npm install && npm run build
Output Directory: frontend/dist
Framework:        Other (None)
```

**Step 3 — Set Environment Variables**
```
NASA_API_KEY   → Production, Preview, Development
GROQ_API_KEY   → Production, Preview, Development
CORS_ORIGIN    → https://<your-project>.vercel.app
VITE_API_URL   → /api
NODE_ENV       → production
```

**Step 4 — Deploy**

Vercel automatically:
- Builds the React/Vite frontend into `frontend/dist`
- Deploys `api/index.ts` as a serverless function with 512MB memory, 30s timeout
- Routes `/api/*` to the function, `/*` to `index.html` (SPA)

---

## 🛠️ Local Development

### Prerequisites

```
node >= 20.19.0
npm  >= 10.x
```

### Clone & Install

```bash
git clone https://github.com/your-username/nasa-mission-control.git
cd nasa-mission-control
npm run install:all
```

This runs `npm install` in root, `frontend/`, and `backend/` concurrently.

### Environment Setup

```bash
cp .env.vercel.example .env
# Fill in NASA_API_KEY and GROQ_API_KEY
```

Create `frontend/.env.local`:
```bash
VITE_API_URL=http://localhost:3001
```

### Start Dev Servers

```bash
# Terminal 1 — Backend API (port 3001)
npm run dev:backend

# Terminal 2 — Frontend (Vite HMR, port 3000)
npm run dev:frontend
```

Open `http://localhost:3000` 🚀

### Production Build (local test)

```bash
npm run build
# Outputs to frontend/dist/
```

---

## 📸 Screenshots

> 📌 *Add your screenshots below — replace the placeholder blocks with your actual image paths or URLs.*

<br/>

### 🔀 Navigation Toggle — APOD ⟷ NeoWS

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "Header navigation showing APOD and NeoWs        │
│   toggle pills with active state indicator"        │
│                                                    │
│  Replace with:                                     │
│  ![Nav Toggle](./screenshots/nav-toggle.png)       │
└────────────────────────────────────────────────────┘
```

<br/>

### 🖼️ APOD Viewer — Image Mode

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "APOD viewer displaying a full-resolution         │
│   astronomy image with HD badge, title, date,      │
│   and action buttons"                              │
│                                                    │
│  Replace with:                                     │
│  ![APOD Image](./screenshots/apod-image.png)       │
└────────────────────────────────────────────────────┘
```

<br/>

### 🖼️ APOD Viewer — Video Mode

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "APOD viewer with embedded YouTube iframe         │
│   for video-type APOD entries"                     │
│                                                    │
│  Replace with:                                     │
│  ![APOD Video](./screenshots/apod-video.png)       │
└────────────────────────────────────────────────────┘
```

<br/>

### 🤖 AI Mission Briefing — Llama 3 Output

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "AI Mission Briefing panel showing the            │
│   Llama 3 · Groq pill badge, typewriter            │
│   markdown reveal, and six briefing sections"      │
│                                                    │
│  Replace with:                                     │
│  ![AI Briefing](./screenshots/ai-briefing.png)     │
└────────────────────────────────────────────────────┘
```

<br/>

### 🗓️ Date Selector — Day Mode

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "Day mode showing the 31-card horizontal          │
│   scrollable strip with selected card              │
│   highlighted and disabled future dates"           │
│                                                    │
│  Replace with:                                     │
│  ![Day Mode](./screenshots/date-day.png)           │
└────────────────────────────────────────────────────┘
```

<br/>

### 🗓️ Date Selector — Month Mode

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "Month mode grid with year navigator              │
│   and disabled months before June 1995"            │
│                                                    │
│  Replace with:                                     │
│  ![Month Mode](./screenshots/date-month.png)       │
└────────────────────────────────────────────────────┘
```

<br/>

### 🗓️ Date Selector — Year Mode

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "Year mode staggered grid from 1995               │
│   to current year with animated entrance"          │
│                                                    │
│  Replace with:                                     │
│  ![Year Mode](./screenshots/date-year.png)         │
└────────────────────────────────────────────────────┘
```

<br/>

### ☄️ NeoWS — Asteroid Tracker Dashboard

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "NeoWS full-width dashboard showing stats bar     │
│   (total, hazardous, closest LD), sortable         │
│   asteroid table with hazard badges and            │
│   color-coded miss distances"                      │
│                                                    │
│  Replace with:                                     │
│  ![NeoWS](./screenshots/neows-dashboard.png)       │
└────────────────────────────────────────────────────┘
```

<br/>

### 🌠 Animated Space Background

```
┌────────────────────────────────────────────────────┐
│  📸 SCREENSHOT PLACEHOLDER                         │
│                                                    │
│  Suggested caption:                                │
│  "Full-viewport canvas background showing          │
│   twinkling stars, pulsing nebulae, and            │
│   a shooting star trail in motion"                 │
│                                                    │
│  Replace with:                                     │
│  ![Space BG](./screenshots/space-background.png)   │
└────────────────────────────────────────────────────┘
```

---

## 🗺️ Roadmap

| Status | Feature |
|---|---|
| ✅ Done | APOD image + video viewer |
| ✅ Done | AI Mission Briefing (Llama 3 / Groq) |
| ✅ Done | Day / Month / Year date selector |
| ✅ Done | NeoWS asteroid tracker + sortable table |
| ✅ Done | Animated space background (canvas) |
| ✅ Done | Offline detection banner |
| ✅ Done | Toast notification system |
| ✅ Done | Rate limiting + Helmet security |
| ✅ Done | Vercel serverless monorepo deploy |
| 🔲 Planned | APOD favourites / collection (localStorage) |
| 🔲 Planned | NeoWS 3D orbital visualisation (Three.js) |
| 🔲 Planned | APOD date range gallery / slideshow mode |
| 🔲 Planned | Share APOD card as downloadable image |
| 🔲 Planned | PWA support (offline caching, install prompt) |
| 🔲 Planned | Dark/light theme toggle |
| 🔲 Planned | NASA Mars Rover image integration |

---

<div align="center">

```
  ·  ✦  ·    ·    ✦  ·      ·    ✦    ·  ·    ✦   ·
      ·    ✦    ·      ·  ✦    ·    ✦    ·    ·  ✦
  ✦    ·  ·    ✦  ·      ·    ✦  ·   ·    ✦  ·     ✦

      🚀  Built with ☕, curiosity, and a deep respect for the cosmos.

  ·  ✦  ·    ·    ✦  ·      ·    ✦    ·  ·    ✦   ·
      ·    ✦    ·      ·  ✦    ·    ✦    ·    ·  ✦
  ✦    ·  ·    ✦  ·      ·    ✦  ·   ·    ✦  ·     ✦
```

**Made with 🖤 for the universe — and everyone trying to understand it.**

[![NASA](https://img.shields.io/badge/Data-NASA_Open_APIs-FC3D21?style=for-the-badge&logo=nasa&logoColor=white)](https://api.nasa.gov/)
[![Groq](https://img.shields.io/badge/AI-Groq_Llama_3-F55036?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>
