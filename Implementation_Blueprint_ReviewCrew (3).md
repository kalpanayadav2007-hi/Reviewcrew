# Implementation Blueprint — ReviewCrew
### Multi-Agent AI Code Review Tool — Days 2–10
**Founder:** Kalpana Yadav · **Program:** AB Talks 60-Day Claude AI Challenge — 10-Day Capstone
**This document is the single source of truth for the remainder of the build.** Each day is written so that a fresh AI conversation can pick it up with zero prior context and continue building without re-planning or redesigning anything.

---

## 📌 Day 2 Update Log
Day 2 (System Design) added one change to this Blueprint: a `GET /api/health` endpoint, folded into Day 3's task list below. No other design decisions changed — the architecture, stack, and scope from Day 1 were confirmed as-is. Full technical detail lives in the companion files: `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`.

## 📌 Day 3 Update Log & Day-Numbering Map
Real-world capstone days and this Blueprint's internal section numbers have diverged — flagging this clearly so no future session gets confused:

| Real capstone day | What happened | Blueprint section to use |
|---|---|---|
| Day 1 | Idea discovery, PRD, Blueprint, Pitch Deck planning | — |
| Day 2 | System design (architecture, schema, API, wireframes, structure) | — |
| **Day 3 (today)** | Environment setup, dependencies, repo/branching, Hello World foundation | Covered by this update, not the original "Day 2" section below |
| **Day 4 (tomorrow)** | First real feature: Quality Agent + orchestrator + `/api/review` | Use the section below titled **"DAY 2 — Orchestrator & First Agent (Quality Agent)"** |
| Day 5 | Bug + Security agents, full orchestrator | Use section titled "DAY 3" below |
| Day 6 | Frontend foundation, API wiring | Use section titled "DAY 4" below |
| Day 7 | Render results, input hardening | Use section titled "DAY 5" below |
| Day 8 | Loading states, error UX | Use section titled "DAY 6" below |
| Day 9 | Visual design polish | Use section titled "DAY 7" below |
| Day 10 | Testing, deployment, submission — may need to compress the original Day 8/9/10 sections into fewer real days, or request a short extension; flag this explicitly at the start of Day 8 | Use sections titled "DAY 8", "DAY 9", "DAY 10" below |

**Action needed:** because setup consumed a full real day (Day 3) that wasn't originally budgeted as its own day, the last 3 Blueprint sections (Day 8/9/10) now map to only 1 remaining real day after Day 9. Flagging this now: **on Day 9 (real), we must explicitly decide whether to compress testing+deployment+submission into one day, or confirm an extra day is available.** Do not silently drop testing or deployment quality to make the date work — surface the tradeoff when we get there.

## 📌 Day 4 Update Log
The AI provider changed from **Anthropic Claude** to **Google Gemini API** (`gemini-3.6-flash`, via `@google/generative-ai`, env var `GEMINI_API_KEY`). Reason: Anthropic's free "Evaluation access" tier lacks usable API credits without a paid top-up, which conflicted with the project's free-tools-only requirement. Google AI Studio's Gemini free tier requires no credit card. This has zero architectural impact — only the SDK/model inside each `agents/*.js` file changes; prompts, JSON contracts, orchestrator logic, and API design are all unchanged. **Any future day's instructions that reference "Claude" or "Anthropic" should be read as "Gemini"/"Google" instead.**

Day 4 (real) completed the Quality Agent, orchestrator, and `/api/review` endpoint — matching this document's "DAY 2" section below. Verified working end-to-end with real AI-generated findings.

## 📌 Day 5 Update Log
Day 5 (real) completed Bug Agent, Security Agent, and the full parallel orchestrator — matching this document's "DAY 3" section below. All 3 agents verified genuinely specialized (zero overlapping findings on a mixed test case). Noted: `agents/*.js` files share duplicated boilerplate, flagged as a future refactor candidate (not urgent, not done yet — see `DAY5-SUMMARY.md`). Backend is now feature-complete for v1.0; Day 6 shifts fully to frontend work.

## 📌 Day 6 Update Log — MVP COMPLETE & LIVE
Day 6 (real) compressed the originally-separate frontend/polish/deployment sections ("DAY 4" through "DAY 9" below) into a single day to recover the schedule slip flagged on Day 3. Completed: full frontend UI (all 4 states), required footer, and live deployment on Render (free tier) for both backend and frontend. CORS restricted to the live frontend origin. Verified fully working end-to-end on the public URLs, not just locally.

## 📌 Day 7 Update Log — TESTING & OPEN-SOURCE POLISH COMPLETE
Day 7 (real) completed the remaining Blueprint scope: cross-language testing (JavaScript, Python, Java — all verified accurate) and full open-source repo polish (README.md rewritten, CONTRIBUTING.md added, TESTING.md added). Also completed a senior-level UX/accessibility pass: fixed a real risk (Render free-tier cold starts could false-trigger the request timeout — extended timeout to 55s with an honest "waking up" message), added screen-reader support (`aria-live`, labels), made severity indicators color-independent (icon + text, not color alone), added visible keyboard focus states, a character counter, a "Try an Example" button, and tab-key support in the code textarea.

**The 10-day capstone's core Blueprint scope is now effectively complete** — a live, tested, accessible, documented, open-source-ready multi-agent AI product. Remaining days can focus on final demo prep, any last polish the founder wants, and submission per the AB Talks Challenge requirements.

**Live URLs:**
- Frontend: https://reviewcrew-frontend.onrender.com
- Backend: https://reviewcrew-backend.onrender.com

**Remaining Blueprint sections still open:** rigorous cross-language testing (originally "DAY 8"), README/open-source polish including CONTRIBUTING.md (originally "DAY 9"). Both are now smaller-scope than originally planned since the app is already live and stable. The Day 3 schedule-slip flag is now effectively resolved — remaining work fits comfortably in 1-2 more sessions.

## 🧭 Project Snapshot (read this first, every day)

- **Product:** ReviewCrew — paste code in any language → 3 AI agents (Quality, Bug, Security) review it independently → combined structured report shown in the browser.
- **Stack:** JavaScript/Node.js end-to-end. Express backend. Plain HTML/CSS/JS frontend (no framework). No Python. No database.
- **Architecture pattern:** Orchestrator-Workers. One backend endpoint (`POST /api/review`) triggers 3 parallel LLM calls (Quality Agent, Bug Agent, Security Agent), each with its own system prompt, then merges results into one JSON response.
- **Explicitly OUT of scope for v1.0:** GitHub/PR integration, CLI tool, user accounts, saved history, multi-file review, Python.
- **Time budget:** 1–2 hours/day. Every day below is scoped to fit that.
- **Repo name candidates (pick one on Day 1):** `reviewcrew`, `codecrew-ai`, `multiagent-code-review`, `review-agents`.
- **Folder structure (created Day 1, referenced every day after):**
```
reviewcrew/
├── backend/
│   ├── server.js
│   ├── agents/
│   │   ├── qualityAgent.js
│   │   ├── bugAgent.js
│   │   └── securityAgent.js
│   ├── orchestrator.js
│   ├── .env              (gitignored — holds API key)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

## 📅 DAY 1 — Setup Foundation *(already scoped separately — see standalone Day 1 guidance)*
Day 1 covers: choosing the LLM API provider, obtaining an API key, initializing the Git repo, creating the folder structure above, and installing Node/Express. Day 2 below assumes all of this is done.

---

## 📅 DAY 2 — Orchestrator & First Agent (Quality Agent)

### 🎯 Objective
Get one working end-to-end slice: backend receives code → calls ONE agent (Quality) → returns a real AI-generated review as JSON. Prove the core architecture works before multiplying it into 3 agents.

### 📖 What I'll learn
- How to structure an Express server and API route
- How to call an LLM API from Node.js (chat completion request/response shape)
- Prompt engineering for a focused, single-purpose agent
- Returning structured JSON from an LLM (not just free text)

### 🛠 Features to build
- `POST /api/review` endpoint that accepts `{ code: string }`
- `qualityAgent.js` — a function that takes code, sends it to the LLM with a Quality-focused system prompt, and returns structured findings
- Basic orchestrator that (for now) just calls the Quality Agent and returns its result

### 📝 Step-by-step implementation plan
1. In `backend/`, run `npm init -y` if not already done, then `npm install express dotenv cors` and the official SDK for your chosen LLM provider (installed on Day 1).
2. Create `backend/agents/qualityAgent.js`. Export an async function `reviewQuality(code)` that:
   - Builds a system prompt: *"You are a senior code quality reviewer. Analyze the given code for readability, naming, structure, and anti-patterns, regardless of programming language. Respond ONLY with valid JSON in this shape: { findings: [ { issue: string, explanation: string, severity: 'low'|'medium'|'high' } ] }."*
   - Sends the user's code as the user message.
   - Parses the response as JSON (strip markdown code fences if present — models sometimes wrap JSON in ```json blocks).
   - Returns the parsed object, or a safe fallback `{ findings: [], error: "..." }` if parsing fails.
3. Create `backend/orchestrator.js`. Export `runReview(code)` that currently just calls and returns `reviewQuality(code)`, wrapped as `{ quality: <result> }`. (We'll add the other 2 agents Day 3.)
4. Create `backend/server.js`:
   - Set up Express, `cors()`, `express.json()`.
   - `POST /api/review` route: validate `code` is present and non-empty, call `orchestrator.runReview(code)`, return the result as JSON. Wrap in try/catch, return 500 with a clear error message on failure.
   - Serve on `process.env.PORT || 3000`.
5. Create `.env` with your API key variable (e.g. `LLM_API_KEY=...`), and `.env.example` with the same key but no value, for the repo.
6. Test locally using `curl` or Postman-style request (see Testing tasks below) before moving on.

### 📂 Files and folders to create or modify
- `backend/agents/qualityAgent.js` (new)
- `backend/orchestrator.js` (new)
- `backend/server.js` (new)
- `backend/.env`, `backend/.env.example` (new)
- `backend/package.json` (modified — dependencies added)

### 🔗 APIs, libraries, services, or tools to integrate
- LLM API SDK (provider chosen Day 1)
- `express`, `cors`, `dotenv` (npm)

### 🧪 Testing tasks
- Run the server locally (`node backend/server.js` or `npm start`).
- Send a test request:
  ```bash
  curl -X POST http://localhost:3000/api/review \
    -H "Content-Type: application/json" \
    -d '{"code":"function add(a,b){return a+b}"}'
  ```
- Confirm you get back valid JSON with a `quality.findings` array (not an error, not raw unparsed text).
- Try an EMPTY code string — confirm the server responds with a clean 400 error, not a crash.

### 🐞 Common issues and debugging tips
- **LLM returns JSON wrapped in ` ```json ... ``` `** → strip triple backticks and the `json` label before `JSON.parse()`.
- **`JSON.parse` throws** → log the raw response text first before parsing, so you can see exactly what came back; wrap parsing in try/catch and return a fallback rather than crashing the server.
- **CORS errors when testing from a browser later** → confirmed `cors()` middleware is registered before your routes.
- **"API key not found" errors** → confirm `.env` is in `backend/` (not project root) and `require('dotenv').config()` is called at the very top of `server.js`.

### ✅ End-of-day checklist
- [ ] Server starts with no errors
- [ ] `POST /api/review` returns real, structured Quality Agent output for a valid code sample
- [ ] Empty input is handled gracefully (no crash)
- [ ] `.env` is in `.gitignore` (verify actual key is NOT committed)

### 📸 Expected project state and screenshots to capture
- Terminal screenshot showing the server running (e.g., "Server listening on port 3000")
- Screenshot of the `curl`/Postman response showing structured JSON output from the Quality Agent

### ➡️ Handoff notes for Day 3
Working: 1 endpoint, 1 agent, real AI responses, JSON parsing solved. Day 3 will duplicate this exact pattern to add the Bug Agent and Security Agent, then update the orchestrator to call all 3 in parallel and merge results — the hard problem (LLM call → clean JSON) is already solved, so Day 3 is mostly repetition + merging logic.

---

## 📅 DAY 3 — Bug Agent + Security Agent + Full Orchestrator

### 🎯 Objective
Complete the multi-agent core: add the remaining two agents and update the orchestrator to run all three in parallel, merging their results into one combined response. This is the architectural heart of the resume story — get it right today.

### 📖 What I'll learn
- Running multiple async operations in parallel (`Promise.all`)
- Designing distinct, non-overlapping prompts for specialized agents
- Merging multiple structured LLM outputs into one clean API response

### 🛠 Features to build
- `backend/agents/bugAgent.js` — focused on logic errors, potential runtime issues, edge cases
- `backend/agents/securityAgent.js` — focused on injection risks, unsafe input handling, hardcoded secrets, unsafe dependencies
- Updated `orchestrator.js` that calls all 3 agents in **parallel** and returns `{ quality, bugs, security }`
- `GET /api/health` endpoint (added during Day 2 System Design) — returns `{ "status": "ok" }`, no auth, no validation. Added to de-risk Render free-tier cold starts ahead of Day 9 deployment; trivial to implement alongside today's work.

### 📝 Step-by-step implementation plan
1. Duplicate the pattern from `qualityAgent.js` to create `bugAgent.js`. Change only the system prompt: *"You are a senior engineer focused exclusively on finding bugs and logic errors. Look for incorrect logic, unhandled edge cases, off-by-one errors, null/undefined risks, and runtime failure points. Ignore style and security — only report functional correctness issues. Respond ONLY with valid JSON: { findings: [ { issue, explanation, severity } ] }."*
2. Duplicate again to create `securityAgent.js` with its own prompt: *"You are a senior application security reviewer. Look ONLY for security issues: injection risks, unsafe input handling, hardcoded secrets/credentials, insecure use of eval or similar, unsafe deserialization, and unvalidated external input. Ignore style and general bugs. Respond ONLY with valid JSON: { findings: [ { issue, explanation, severity } ] }."*
3. Update `orchestrator.js`:
   ```js
   const [quality, bugs, security] = await Promise.all([
     reviewQuality(code),
     reviewBugs(code),
     reviewSecurity(code),
   ]);
   return { quality, bugs, security };
   ```
4. Add basic per-agent error isolation: if one agent's call fails, the other two should still return successfully (don't let one failure kill the whole response). Use `Promise.allSettled` instead of `Promise.all` if you want full isolation, and map results back to `{ status, value }` shape — decide based on how much time you have today; `Promise.all` is simpler and fine if you trust the API's reliability.
5. Re-test the same way as Day 2, confirming all 3 sections come back populated and genuinely different from each other (paste code with an obvious bug AND an obvious style issue to confirm the agents specialize correctly).

### 📂 Files and folders to create or modify
- `backend/agents/bugAgent.js` (new)
- `backend/agents/securityAgent.js` (new)
- `backend/orchestrator.js` (modified)

### 🔗 APIs, libraries, services, or tools to integrate
- None new — reuses Day 2's LLM SDK setup

### 🧪 Testing tasks
- Test with a code snippet that has a clear bug (e.g., an off-by-one loop) — confirm Bug Agent catches it and Quality/Security don't just repeat the same finding.
- Test with a snippet containing a hardcoded API key or `eval()` call — confirm Security Agent flags it specifically.
- Time the full request — confirm parallel calls are meaningfully faster than they would be sequentially.
- Test with intentionally broken/malformed code — confirm no crash, agents still return a graceful response.

### 🐞 Common issues and debugging tips
- **All 3 agents give near-identical, overlapping feedback** → your prompts aren't specialized enough; make each agent's "ignore this" instruction more explicit (e.g., Bug Agent should explicitly say "ignore naming/style issues").
- **One slow agent call delays the whole response** → this is expected with `Promise.all`; if it's a real problem, consider a loading UI (Day 6) rather than optimizing prematurely.
- **Rate limit errors when testing repeatedly** → space out test calls; note the free-tier limit for your provider (checked Day 1) and stay under it.

### ✅ End-of-day checklist
- [ ] All 3 agents exist and have clearly distinct prompts
- [ ] Orchestrator calls all 3 in parallel and returns a combined object
- [ ] Manually verified the agents produce genuinely different, non-redundant findings
- [ ] No crash on malformed/edge-case code input

### 📸 Expected project state and screenshots to capture
- Screenshot of a full `curl`/Postman response showing all 3 sections (`quality`, `bugs`, `security`) populated
- Screenshot of terminal showing request timing (to confirm parallel execution)

### ➡️ Handoff notes for Day 4
The full multi-agent backend is functionally complete and is the core technical achievement of this project. Day 4 shifts to the frontend: building the basic paste-code UI and wiring it to this working `/api/review` endpoint. No further backend architecture decisions are needed — Day 4 only needs to call the existing endpoint and display its response.

---

## 📅 DAY 4 — Frontend Foundation (Input + API Wiring)

### 🎯 Objective
Build the basic web UI: a code input box, a "Review Code" button, and the JavaScript to call the backend and log the raw response. No pretty formatting yet — just prove the frontend and backend talk to each other correctly.

### 📖 What I'll learn
- Structuring a simple static frontend (no framework)
- Making a `fetch()` POST request from the browser
- Basic loading/disabled-button state handling

### 🛠 Features to build
- Static HTML page with a textarea, button, and empty results container
- `script.js` that sends the textarea content to `/api/review` and logs the response
- Local dev setup so frontend can reach the backend (CORS already handled Day 2)

### 📝 Step-by-step implementation plan
1. In `frontend/index.html`, build a minimal structure: a heading ("ReviewCrew"), a `<textarea id="codeInput">`, a `<button id="reviewBtn">Review Code</button>`, and an empty `<div id="results"></div>`. Link `style.css` and `script.js`.
2. In `frontend/script.js`, add a click listener on `reviewBtn` that:
   - Reads the textarea value.
   - If empty, show a simple inline message ("Paste some code first") and stop.
   - Disables the button and shows a loading message.
   - Sends `fetch('http://localhost:3000/api/review', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ code }) })`.
   - On response, `console.log()` the parsed JSON for now (formatting comes Day 6) and re-enable the button.
   - On error (network failure, non-200 response), show a simple error message in the results div.
3. Add minimal `style.css` — just enough for a readable layout (max-width container, monospace font for the textarea, basic button styling). Full visual polish comes Day 7.
4. Serve the frontend locally for testing — simplest option: open `index.html` directly in the browser, or use a tiny static server (e.g., VS Code's Live Server extension) if `fetch` to `localhost:3000` has issues with `file://` origins.
5. Test the full loop manually: paste code in browser → click button → confirm `console.log` shows the real 3-agent response from the backend.

### 📂 Files and folders to create or modify
- `frontend/index.html` (new)
- `frontend/style.css` (new, basic only)
- `frontend/script.js` (new)

### 🔗 APIs, libraries, services, or tools to integrate
- None — plain HTML/CSS/JS, calling the existing backend endpoint

### 🧪 Testing tasks
- Paste valid code, click Review, confirm browser console shows the full 3-agent JSON response.
- Click Review with an empty textarea — confirm the inline "paste some code first" message appears and no network request is sent.
- Temporarily stop the backend server and click Review — confirm the frontend shows a clean error message instead of hanging silently.

### 🐞 Common issues and debugging tips
- **`fetch` fails with a CORS error** → double check the backend's `cors()` middleware from Day 2 is active, and that you're hitting the correct `http://localhost:PORT` (not `file://`).
- **Button stays disabled after an error** → make sure the disable/enable logic runs in a `finally` block, not just after a successful response.
- **Nothing happens on click** → check the browser console for a JS error first (common cause: script.js loaded before the DOM, or an id mismatch between HTML and JS).

### ✅ End-of-day checklist
- [ ] Clicking "Review Code" with valid code logs a full 3-agent response in the console
- [ ] Empty input is blocked with a visible message, no network call made
- [ ] Backend-down scenario shows a graceful error, not a silent failure or crash

### 📸 Expected project state and screenshots to capture
- Screenshot of the basic (unstyled) UI in the browser
- Screenshot of the browser console showing the logged 3-agent response after clicking Review

### ➡️ Handoff notes for Day 5
Frontend and backend are now fully wired end-to-end. The console shows real data. Day 5 focuses on rendering that JSON response as an actual readable report in the results div (instead of just logging it), plus improving input handling (e.g., basic language auto-label, character limits).

---

## 📅 DAY 5 — Render Results & Input Hardening

### 🎯 Objective
Turn the raw JSON response into a genuinely readable report in the browser, and harden the input side against obvious edge cases (oversized input, whitespace-only input).

### 📖 What I'll learn
- Dynamically building DOM elements from structured JSON data
- Basic input validation/limits on the frontend
- Passing simple limits through to the backend for consistency

### 🛠 Features to build
- A `renderResults(data)` function that builds 3 labeled sections (Quality / Bugs / Security) with each finding shown as a list item, including severity
- Frontend character-limit guard (e.g., reject or warn above ~5,000 characters, since huge inputs risk timeouts/cost)
- Matching backend-side input length guard for consistency

### 📝 Step-by-step implementation plan
1. In `script.js`, replace the `console.log` from Day 4 with a `renderResults(data)` function that:
   - Clears the `#results` div.
   - For each of `quality`, `bugs`, `security` in the response, creates a section with a heading (e.g., "🔍 Quality Findings") and a list of findings, each showing `issue`, `explanation`, and a colored severity tag (e.g., red/orange/green text or badge for high/medium/low).
   - If a section's `findings` array is empty, show "No issues found in this category" rather than a blank space.
2. Add a simple severity-to-color mapping (e.g., high = red, medium = orange, low = green) applied via CSS class, not inline styles, so Day 7 styling work stays clean.
3. Add a frontend guard: if `codeInput.value.length > 5000`, show a warning message and don't send the request (prevents accidental huge pastes from causing slow/costly requests).
4. Add a matching guard in `server.js`: if `code.length > 5000` (or your agreed limit), return a 400 with a clear message — never trust frontend validation alone.
5. Test with a whitespace-only input (e.g., just spaces/newlines) — should be treated the same as empty input, not sent as a "valid" review request.

### 📂 Files and folders to create or modify
- `frontend/script.js` (modified — add `renderResults`, input guards)
- `frontend/style.css` (modified — severity color classes)
- `backend/server.js` (modified — length validation)

### 🔗 APIs, libraries, services, or tools to integrate
- None new

### 🧪 Testing tasks
- Submit code with clear issues across all 3 categories — confirm each section renders correctly with the right findings under the right heading.
- Submit clean, well-written code — confirm sections gracefully show "No issues found" rather than breaking or looking empty/broken.
- Submit whitespace-only input — confirm it's blocked like empty input.
- Submit an oversized paste (over your limit) — confirm both frontend and backend reject it with a clear message.

### 🐞 Common issues and debugging tips
- **Results render in the wrong order or misaligned with headings** → make sure you're iterating in a fixed order (`['quality','bugs','security']`) rather than relying on object key order from the API.
- **"No issues found" never shows** → check you're testing the `findings.length === 0` case explicitly, not just assuming empty arrays render fine by default.
- **Severity colors don't show** → confirm the CSS class names in JS exactly match the class names defined in `style.css` (case-sensitive).

### ✅ End-of-day checklist
- [ ] All 3 categories render as readable, labeled sections with real findings
- [ ] Empty-findings case shows a clear "no issues" message, not a blank area
- [ ] Oversized and whitespace-only input are both blocked, frontend AND backend
- [ ] Severity is visually distinguishable (color/tag)

### 📸 Expected project state and screenshots to capture
- Screenshot of a full rendered report in the browser for code with mixed issues across categories
- Screenshot of the "no issues found" state for clean code

### ➡️ Handoff notes for Day 6
The tool is now functionally complete end-to-end and demoable, just visually rough. Day 6 adds proper loading states and error UX polish; Day 7 handles full visual design. No further logic changes are needed — Day 6–7 are UI/UX only, layered on top of this working functionality.

---

## 📅 DAY 6 — Loading States & Error UX Polish

### 🎯 Objective
Make the "waiting" and "something went wrong" moments feel intentional and professional, not broken — this matters a lot for demo quality and interview impressions.

### 📖 What I'll learn
- Designing clear loading/empty/error states as first-class UI states (not afterthoughts)
- Basic UX writing (short, clear status messages)

### 🛠 Features to build
- A visible loading indicator (spinner or animated text) shown during the ~5–20 second wait for the 3 agents to respond
- A distinct, clearly styled error state (different from the loading and results states)
- Disabled input/button during loading to prevent duplicate submissions

### 📝 Step-by-step implementation plan
1. Define 3 explicit UI states in `script.js`: `idle`, `loading`, `results`, `error` — use a simple function like `setState(state, payload)` that shows/hides the right elements for each state, rather than scattering `display` toggles across the code.
2. For `loading`: show a simple CSS spinner (a rotating border div is enough — no external library needed) plus a short text like "Running 3 AI agents on your code…".
3. For `error`: show a clearly styled message box (distinct background/border color) with the actual error reason when safe to show (e.g., "Server error — please try again" rather than raw stack traces).
4. Ensure the button and textarea are disabled during `loading` and re-enabled on both `results` and `error` outcomes.
5. Add a timeout safeguard on the frontend fetch (e.g., abort after ~30 seconds) so a hung request doesn't leave the user staring at a spinner forever — show the error state if it fires.

### 📂 Files and folders to create or modify
- `frontend/script.js` (modified — state management, timeout)
- `frontend/style.css` (modified — spinner, error box styling)

### 🔗 APIs, libraries, services, or tools to integrate
- None new (spinner built with pure CSS)

### 🧪 Testing tasks
- Trigger loading state and confirm spinner/message appears immediately on click.
- Stop the backend mid-test and confirm the error state displays clearly, distinctly styled from both loading and results.
- Confirm the button cannot be clicked again while loading (no duplicate requests fire).
- Let a request run to completion and confirm it transitions cleanly from loading → results with nothing left over from the loading state.

### 🐞 Common issues and debugging tips
- **Spinner keeps spinning after results load** → confirm `setState('results', data)` actually hides the loading element; a common bug is forgetting to hide the previous state when showing a new one.
- **Double submissions still possible** → confirm the button's `disabled` attribute is set synchronously right when the click handler starts, not after the fetch begins.
- **AbortController timeout also fires on slow-but-successful requests** → make sure your timeout value is generous enough for 3 parallel LLM calls (start around 30s, adjust based on real observed response times from Day 3).

### ✅ End-of-day checklist
- [ ] Loading state is visually distinct and appears immediately on submit
- [ ] Error state is visually distinct from both loading and results
- [ ] Button/input disabled correctly during loading, re-enabled after
- [ ] Timeout safeguard tested and working

### 📸 Expected project state and screenshots to capture
- Screenshot of the loading state mid-request
- Screenshot of the error state (backend stopped, or simulated failure)

### ➡️ Handoff notes for Day 7
All functional states (idle, loading, results, error) now exist and work correctly. Day 7 is pure visual design — applying a real color palette, typography, and layout polish across all these existing states. No new states or logic should be introduced Day 7; only how things look.

---

## 📅 DAY 7 — Visual Design Polish

### 🎯 Objective
Make ReviewCrew look like a real, intentional product — not a prototype — since this is what a recruiter or interviewer will actually see and screenshot.

### 📖 What I'll learn
- Applying a cohesive color palette and typography system with plain CSS
- Basic responsive layout techniques (so it doesn't break on smaller screens)

### 🛠 Features to build
- A defined color palette and consistent spacing system applied across the whole UI
- Polished typography (font choices, sizing hierarchy for headings vs. body vs. code)
- A responsive layout that remains usable on a narrower browser window/mobile

### 📝 Step-by-step implementation plan
1. Pick a simple, intentional palette suited to a dev tool — e.g., a dark charcoal background with a single accent color (avoid generic default blue; consider a teal or violet accent), OR a clean light theme with a strong single accent — commit to one and apply it consistently via CSS custom properties (`:root { --bg: ...; --accent: ...; }`).
2. Set a clear typographic hierarchy: page title, section headings (Quality/Bugs/Security), body text, and code text (monospace font for the textarea and any code shown in findings).
3. Style the severity tags from Day 5 properly now (small rounded badges: red/orange/green background with white text, not just colored text).
4. Add breathing room: consistent padding/margins around the input panel and each results section; avoid content touching the edges of the screen.
5. Add a simple responsive rule: on narrow screens (`@media (max-width: 600px)`), stack elements vertically and reduce padding, so the tool remains usable on mobile.
6. Do a final visual pass across ALL states from Day 6 (idle, loading, results with findings, results with no issues, error) to make sure the new styling applies consistently everywhere, not just the "happy path."

### 📂 Files and folders to create or modify
- `frontend/style.css` (major revision)
- `frontend/index.html` (minor — possibly added wrapper divs for layout)

### 🔗 APIs, libraries, services, or tools to integrate
- None — plain CSS only, no UI framework, to keep the stack simple and dependency-free

### 🧪 Testing tasks
- Resize the browser window down to mobile width and confirm layout doesn't break or overflow.
- Visually check every state (idle/loading/results/error) with the new styling applied.
- Check color contrast is readable (dark text on light background or light text on dark — never low-contrast combinations).

### 🐞 Common issues and debugging tips
- **Layout breaks on narrow screens** → check for fixed pixel widths instead of `max-width`/`%`; these are the most common cause of mobile overflow.
- **Inconsistent spacing between sections** → define spacing values once as CSS variables (e.g., `--space-md: 16px`) and reuse them everywhere instead of picking arbitrary numbers per element.
- **Severity badges look inconsistent in size** → give them a fixed `padding` and `border-radius` in one shared CSS class, not per-instance styling.

### ✅ End-of-day checklist
- [ ] Consistent color palette and spacing applied across the entire UI
- [ ] Clear typographic hierarchy (title / section / body / code)
- [ ] Responsive layout confirmed on a narrow browser width
- [ ] All 4 states (idle/loading/results/error) look polished, not just the happy path

### 📸 Expected project state and screenshots to capture
- Full-page screenshot of the polished results view (desktop width)
- Screenshot of the same view at mobile width
- Screenshot of the polished idle/empty state

### ➡️ Handoff notes for Day 8
The product is now feature-complete and visually polished. Day 8 shifts entirely to testing — no new features or styling should be added; the goal is to find and fix bugs across multiple languages and edge cases before deployment.

---

## 📅 DAY 8 — Cross-Language Testing & Bug Fixing

### 🎯 Objective
Rigorously test the tool across multiple languages and edge cases, and fix whatever breaks. This is the day that turns "it worked when I built it" into "it actually works."

### 📖 What I'll learn
- Systematic manual QA practices for an AI-powered tool
- How to write a simple test log/checklist for a portfolio project (useful for the README later)

### 🛠 Features to build
- No new features today — bug fixes only, based on testing findings
- A `TESTING.md` log documenting what was tested and the outcome (useful for the repo and as evidence of rigor)

### 📝 Step-by-step implementation plan
1. Prepare at least 5 test code snippets across at least 2–3 languages (e.g., JavaScript, Python, and one more — Java or C++), each with at least one deliberate issue (a bug, a style problem, or a security flaw) so you can verify the right agent catches the right thing.
2. Run each snippet through the live local app and record, in `TESTING.md`: the snippet's language, what issue was deliberately included, and what each of the 3 agents actually reported.
3. Test edge cases explicitly: extremely short code (one line), code with unusual formatting/no indentation, code containing comments only, and non-code text pasted by mistake (confirm the agents respond sensibly rather than erroring).
4. Fix any real bugs found (parsing failures, UI rendering issues, crashes) — prioritize anything that breaks the app over anything that's just "the AI's opinion could be better."
5. Re-run the full happy-path flow (paste → review → results) one final time end-to-end after fixes to confirm nothing regressed.

### 📂 Files and folders to create or modify
- `TESTING.md` (new — test log)
- Bug fixes across `backend/agents/*.js`, `orchestrator.js`, `server.js`, `frontend/script.js` as needed (only where real issues are found)

### 🔗 APIs, libraries, services, or tools to integrate
- None new

### 🧪 Testing tasks
- (This entire day IS the testing task — see implementation plan above.)
- Explicitly confirm: no scenario causes a full app crash or infinite loading with no error shown.

### 🐞 Common issues and debugging tips
- **Agents behave inconsistently between runs on the same code** → this is expected LLM variability, not a bug; note it in `TESTING.md` rather than trying to "fix" non-determinism.
- **Non-code text input causes a strange response** → make sure the agents' prompts include an instruction like "If the input is not valid code, note this in your findings rather than fabricating issues," and handle it gracefully in the UI either way.
- **One language performs noticeably worse than others** → check if the issue is prompt-related (agents can be made explicitly language-agnostic in wording) rather than something requiring per-language logic (out of scope).

### ✅ End-of-day checklist
- [ ] At least 5 snippets across 2–3+ languages tested and logged in `TESTING.md`
- [ ] Edge cases (very short input, non-code input, unusual formatting) tested
- [ ] All discovered bugs fixed and re-verified
- [ ] Full happy-path flow re-confirmed working after fixes

### 📸 Expected project state and screenshots to capture
- Screenshot of `TESTING.md` content
- Screenshot of at least one non-JavaScript language test (e.g., Python snippet) producing a correct review

### ➡️ Handoff notes for Day 9
The app is now tested, stable, and bug-fixed locally. Day 9 moves it to a live, public deployment and prepares the GitHub repository for open-source visibility. No further feature or logic changes should happen Day 9 unless deployment reveals an environment-specific bug.

---

## 📅 DAY 9 — Deployment & Open-Source Repo Polish

### 🎯 Objective
Get ReviewCrew live on a public URL, and make the GitHub repository genuinely presentable — this is what turns local code into a real, linkable portfolio piece.

### 📖 What I'll learn
- Deploying a Node.js backend and a static frontend to a free hosting platform
- Managing environment variables/secrets safely in a deployed environment
- Writing an effective open-source README

### 🛠 Features to build
- Live deployment of both backend and frontend (platform selected Day 1)
- Production-ready environment variable setup (API key stored securely in the hosting platform, never committed)
- `README.md`, `LICENSE`, `CONTRIBUTING.md` written for public/open-source visibility

### 📝 Step-by-step implementation plan
1. Deploy the backend to the chosen free hosting platform: connect the GitHub repo, set the build/start command (e.g., `node backend/server.js`), and add the API key as a secret/environment variable in the platform's dashboard — never in committed code.
2. Update `frontend/script.js`'s fetch URL from `http://localhost:3000` to the live deployed backend URL (consider using a simple environment-aware constant so local dev still works too).
3. Deploy the frontend as static files (same platform if it supports static hosting, or a suitable free static host) — confirm it correctly calls the live backend and CORS is configured to allow the deployed frontend's origin.
4. Do a full live smoke test: open the deployed URL fresh (not localhost), paste code, confirm a real end-to-end review works publicly.
5. Write `README.md` covering: project name and one-line pitch, the problem it solves, key features, the multi-agent architecture (briefly explained with a simple diagram or bullet list), tech stack, how to run locally, and the live demo link.
6. Add a permissive open-source `LICENSE` (e.g., MIT) and a short `CONTRIBUTING.md` explaining how others could contribute (even briefly — shows intent).
7. Push everything, confirm the public repo looks clean: no `.env` committed, no stray test files, clear folder structure matching the plan at the top of this document.

### 📂 Files and folders to create or modify
- `README.md` (new/expanded)
- `LICENSE` (new)
- `CONTRIBUTING.md` (new)
- `.gitignore` (verified — confirm `.env`, `node_modules/` excluded)
- `frontend/script.js` (modified — live backend URL)

### 🔗 APIs, libraries, services, or tools to integrate
- Chosen free hosting platform (from Day 1)

### 🧪 Testing tasks
- Open the live URL in an incognito/private browser window (avoids any local cache/state) and run a full review end-to-end.
- Confirm the API key is NOT visible anywhere in deployed frontend code, network requests, or the public GitHub repo.
- Click through the README on GitHub as if you were a stranger — confirm it's clear what the project does and how to try it.

### 🐞 Common issues and debugging tips
- **CORS errors only in production, not locally** → the deployed frontend's origin differs from `localhost`; update the backend's `cors()` config to explicitly allow the deployed frontend URL.
- **"Works locally, 500 error in production"** → almost always a missing environment variable on the hosting platform; double-check the API key was actually added in the platform's dashboard, not just your local `.env`.
- **Frontend loads but API calls fail silently** → confirm the fetch URL was actually updated to the deployed backend address, not left pointing at `localhost`.

### ✅ End-of-day checklist
- [ ] Backend is live and reachable at a public URL
- [ ] Frontend is live and successfully calls the live backend
- [ ] Full review flow tested successfully in a fresh/incognito browser session
- [ ] README, LICENSE, CONTRIBUTING.md all present and clearly written
- [ ] No secrets committed to the public repo

### 📸 Expected project state and screenshots to capture
- Screenshot of the live deployed app URL with a completed review shown
- Screenshot of the GitHub repo's main page showing the README rendered

### ➡️ Handoff notes for Day 10
The product is fully live, tested, and open-source-ready. Day 10 is final QA, documentation alignment, and making sure the PRD/Blueprint/Pitch Deck all match what was actually built (update any deltas), plus preparing the project for submission/demo.

---

## 📅 DAY 10 — Final QA, Documentation Alignment & Submission

### 🎯 Objective
Close out the capstone: final end-to-end QA on the live product, reconcile documentation with what was actually built, and prepare a clean submission/demo package.

### 📖 What I'll learn
- Final-mile QA discipline (the difference between "done" and "shippable")
- How to present a finished project professionally (demo framing, documentation consistency)

### 🛠 Features to build
- No new features — this day is QA, documentation, and presentation only
- Optional (only if time truly allows): a short recorded demo walkthrough or GIF for the README

### 📝 Step-by-step implementation plan
1. Run the full user flow on the LIVE deployed link at least 3 times with different code samples (different languages, different issue types) to confirm reliability, not just a single lucky run.
2. Re-read `README.md`, the PRD, and this Implementation Blueprint side-by-side with the actual live product — correct any description that no longer matches reality (e.g., if a stretch goal was or wasn't reached, if the tech stack shifted slightly).
3. If any stretch goals (GitHub PR integration, CLI) were reached, document them clearly as "bonus features" in the README, separate from the core v1.0 scope — don't blur the line between committed scope and stretch achievements.
4. If stretch goals were NOT reached, that's expected and fine — confirm the README's "Future Scope" section (mirroring the Pitch Deck) lists them as clear next steps, framing it as intentional roadmap rather than an unfinished feature.
5. Do a final check of the public GitHub repo as a stranger would see it: does the README alone explain what this is, why it matters, and how to try it, within 30 seconds of reading?
6. Prepare a short (2–3 sentence) spoken/written project summary for interviews or demos, e.g.: *"ReviewCrew is a multi-agent AI code review tool — three specialized AI agents independently analyze code for quality, bugs, and security, then combine their findings into one structured report. It's live, open-source, and built entirely in JavaScript, demonstrating real agentic AI architecture rather than a single-prompt chatbot."*
7. Submit the project per the AB Talks Challenge's submission requirements (live link + GitHub repo link + any required write-up).

### 📂 Files and folders to create or modify
- `README.md` (final corrections/alignment only)
- No code changes expected unless final QA finds a genuine bug

### 🔗 APIs, libraries, services, or tools to integrate
- None new

### 🧪 Testing tasks
- 3+ full end-to-end runs on the live link with varied inputs
- Fresh-eyes read-through of README for clarity and accuracy
- Confirm all links (live demo, GitHub repo) actually work when clicked from a completely fresh browser/session

### 🐞 Common issues and debugging tips
- **Live app "worked yesterday," fails today** → check free-tier hosting platforms for sleep/cold-start behavior; the first request after inactivity may be slow or fail once — document this as a known limitation if it can't be fully resolved in remaining time.
- **Documentation describes features slightly differently than what was built** → always let the live product be the source of truth; adjust the docs to match reality, not the other way around.

### ✅ End-of-day checklist
- [ ] Live product tested 3+ times successfully with varied inputs
- [ ] README, PRD, and Blueprint all accurately reflect the final build
- [ ] Future Scope / stretch goals clearly and honestly documented
- [ ] Project summary written and ready for interviews/demos
- [ ] Submission completed per challenge requirements

### 📸 Expected project state and screenshots to capture
- Final screenshot of the live app in use
- Screenshot of the final GitHub repo homepage
- Screenshot/confirmation of successful submission

### ➡️ Project complete
ReviewCrew v1.0 is live, tested, documented, and submitted — a working multi-agent AI product built and shipped in 10 days, ready to be listed on your resume, LinkedIn, and GitHub/GSSoC profile.

---

## 📎 Appendix: Naming Options
- **ReviewCrew** *(recommended — used throughout this document)*
- CodeCrew AI
- Review Agents
- MultiMind Review
- TriCheck AI

## 📎 Appendix: Cross-Day Consistency Rules
To keep every day's AI conversation aligned even if started fresh, always assume:
- Stack is JavaScript/Node.js only — never suggest Python.
- GitHub integration and CLI are stretch-only — do not treat them as required for "done."
- The 3 agents are Quality, Bug, and Security — always these three, always independently reasoned.
- No database, no user accounts, no saved history in v1.0 — if asked to add these, treat as a Day 11+/future idea, not part of this capstone.
