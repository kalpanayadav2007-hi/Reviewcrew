# ReviewCrew — Environment & Tooling Reference

## Environment Variables

All environment variables live in `backend/.env` (never committed — see `backend/.env.example` for the template).

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your personal Google Gemini API key, used by all 3 agents to make Gemini API calls. Get one free (no card) at aistudio.google.com/apikey. Starts with `AIza`. **(Updated Day 4 — originally planned as `ANTHROPIC_API_KEY`; switched because Anthropic's free tier lacked usable credits without payment.)** |
| `PORT` | No | Port the backend server runs on. Defaults to `3000` if not set (see `server.js`: `process.env.PORT || 3000`). Will be set automatically by Render in production (Day 9). |

## Runtime & Tooling

| Tool | Version (as developed) | Purpose |
|---|---|---|
| Node.js | v22.23.1 | JavaScript runtime — runs the Express backend |
| npm | 10.9.8 | Package manager — installs and manages dependencies |
| Git | (system default) | Version control |

## npm Dependencies (backend)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | Web server framework — handles routing (`/api/review`, `/api/health`) |
| `cors` | ^2.8.6 | Allows the frontend (different origin) to call the backend without browser blocking |
| `dotenv` | ^17.4.2 | Loads `.env` variables into `process.env` |
| `@google/generative-ai` | latest | Official SDK for making Gemini API calls (used starting Day 4) |

## VS Code Extensions (recommended, not required)

| Extension | Publisher | Purpose |
|---|---|---|
| ESLint | Microsoft | Flags JavaScript errors/style issues as you type |
| DotENV | mikestead | Syntax highlighting for `.env` files |

## External Services

| Service | Plan | Notes |
|---|---|---|
| Google AI Studio (Gemini) | Free tier | No credit card required. Used for all 3 agents (`gemini-3.6-flash`). Switched from Anthropic on Day 4 — see PROVIDER SWITCH note below. |
| Render (planned, Day 9) | Free tier | Will host both backend (Web Service) and frontend (Static Site) |

## Provider Switch (Day 4)
Originally planned: Anthropic Claude API. Actual: **Google Gemini API**.
**Reason:** Anthropic's free "Evaluation access" plan does not include usable API call credits without a paid top-up. The project required a genuinely free (no credit card) option, so we switched to Google AI Studio's Gemini free tier, which meets that requirement with no cost and no card. Architecture, prompts, and JSON contracts are unchanged — only the SDK and model name differ (`@google/generative-ai`, model `gemini-3.6-flash`).

## Known Configuration Notes
- `dotenv`'s console "tip" ads are silenced via `{ quiet: true }` passed to `.config()` in `server.js` — this is intentional, not a missing feature.
- CORS is currently open (`cors()` with no restrictions) for local development. This should be tightened to allow only the deployed frontend's specific origin once we reach Day 9 deployment — noted here so it isn't forgotten.
