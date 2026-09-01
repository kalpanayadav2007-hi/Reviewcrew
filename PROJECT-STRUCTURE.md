# ReviewCrew — Project Structure

```
Reviewcrew/
├── backend/
│   ├── agents/
│   │   ├── qualityAgent.js     # Quality-focused Claude call + prompt
│   │   ├── bugAgent.js         # Bug-focused Claude call + prompt
│   │   └── securityAgent.js    # Security-focused Claude call + prompt
│   ├── server.js               # Express app, routes (/api/review, /api/health)
│   ├── orchestrator.js         # Calls all 3 agents in parallel, merges results
│   ├── .env                    # API key (gitignored, never committed)
│   ├── .env.example            # Template showing required var names, no real values
│   └── package.json            # Created Day 3 via npm init
├── frontend/
│   ├── index.html              # Single page, all 4 UI states
│   ├── style.css               # Palette, typography, responsive rules
│   └── script.js                # fetch logic, state management, rendering
├── .gitignore                  # Excludes node_modules/, .env
├── LICENSE                     # MIT
└── README.md                   # Project overview, setup instructions, live demo link
```

## Folder Responsibilities

### `backend/`
Everything server-side. Contains the Express app, the orchestrator, and the 3 agent modules. No frontend code lives here.

### `backend/agents/`
Each file is one independent AI specialist. Each exports a single async function (e.g., `reviewQuality(code)`) that builds a focused system prompt, calls the Claude API, and returns parsed JSON findings. **Nothing in this folder knows about the other agents** — they are fully independent, which is what makes the "multi-agent" architecture real rather than cosmetic.

### `backend/orchestrator.js`
The one file that knows about all 3 agents. Calls them in parallel and merges their results into the single response shape defined in `API.md`. This is the architectural core of the project.

### `backend/server.js`
Stays intentionally thin — only HTTP routing (`/api/review`, `/api/health`), request validation, and error handling. No business logic lives here; it delegates to `orchestrator.js`.

### `frontend/`
Flat structure — no subfolders needed since this is a single-page app with no routing. `index.html` defines structure, `style.css` defines all visual design, `script.js` handles state management (`idle`/`loading`/`results`/`error`) and API calls.

## Where Future Code Will Live
- If saved history is added later (out of scope for v1.0): a `backend/db/` folder and a schema file, per the "Future Schema" section in `SCHEMA.md`.
- If GitHub PR integration is added as a stretch goal: a new `backend/integrations/github.js` file, without needing to restructure anything else.
- If a CLI is added as a stretch goal: a new top-level `cli/` folder, fully separate from `frontend/` and `backend/`.

## Why This Structure
It mirrors the system architecture directly (see `ARCHITECTURE.md`): `agents/` holds the 3 independent specialists, `orchestrator.js` is the single coordination point, and `server.js` is a thin routing layer. Anyone opening this repository — a recruiter, an interviewer, or an open-source contributor — can understand the entire system's design just from the folder names, without reading a line of code first.
