# ReviewCrew — System Architecture

## Overview
ReviewCrew follows an **Orchestrator-Workers** pattern. A single backend endpoint receives code, an orchestrator function triggers three independent AI agent calls in parallel, and their results are merged into one structured response.

## Component Diagram

```mermaid
graph TD
    A[User Browser] -->|1. Paste code, click Review| B[Frontend: index.html/script.js]
    B -->|2. POST /api/review| C[Backend: Express server.js]
    C -->|3. runReview code| D[Orchestrator: orchestrator.js]
    D -->|4a. parallel call| E[Quality Agent]
    D -->|4b. parallel call| F[Bug Agent]
    D -->|4c. parallel call| G[Security Agent]
    E -->|5a| H[Anthropic Claude API]
    F -->|5b| H
    G -->|5c| H
    H -->|6. AI responses| E
    H -->|6. AI responses| F
    H -->|6. AI responses| G
    E -->|7a. findings JSON| D
    F -->|7b. findings JSON| D
    G -->|7c. findings JSON| D
    D -->|8. merged result| C
    C -->|9. combined JSON| B
    B -->|10. render report| A
```

## Request Lifecycle (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend (Express)
    participant O as Orchestrator
    participant AI as Claude API

    U->>FE: Paste code, click "Review Code"
    FE->>FE: Validate (non-empty, under 5000 chars)
    FE->>BE: POST /api/review { code }
    BE->>BE: Validate request body
    BE->>O: runReview(code)
    par Quality Agent
        O->>AI: system prompt + code (quality focus)
        AI-->>O: JSON findings
    and Bug Agent
        O->>AI: system prompt + code (bug focus)
        AI-->>O: JSON findings
    and Security Agent
        O->>AI: system prompt + code (security focus)
        AI-->>O: JSON findings
    end
    O->>O: Merge into { quality, bugs, security }
    O-->>BE: combined result
    BE-->>FE: 200 OK + JSON
    FE->>FE: renderResults(data)
    FE-->>U: Structured report displayed
```

## AI Interaction Model
- Each agent (Quality, Bug, Security) makes an **independent** Claude API call with its own system prompt.
- Prompts explicitly instruct each agent to ignore concerns outside its focus area, preventing overlapping/redundant findings.
- All three calls run in parallel (`Promise.all` or `Promise.allSettled`) to keep total latency close to a single call's latency rather than 3x.
- Each response is parsed as JSON independently; a malformed response from one agent is handled gracefully (fallback empty findings + error flag) without crashing the other two.

## External Services
- **Anthropic Claude API** — sole external dependency for v1.0.
- No database service, no auth provider, no GitHub API integration in v1.0.

## Hosting Architecture
- **Backend:** Render Web Service (Node.js/Express), environment variables (API key) stored in Render's dashboard, never committed.
- **Frontend:** Render Static Site (or GitHub Pages as fallback), calling the backend's public URL.
- CORS on the backend explicitly allows the deployed frontend's origin.

## Why This Architecture
- **Stateless:** no database needed, matching the PRD's explicit v1.0 scope (no accounts, no history).
- **Parallelizable:** the 3-agent design naturally benefits from concurrent execution, keeping the UX responsive despite 3 separate LLM calls.
- **Clean separation of concerns:** `server.js` only handles HTTP routing; `orchestrator.js` only coordinates; each `agents/*.js` file only knows how to talk to Claude for its one specialty. This makes the codebase easy to explain in an interview and easy for open-source contributors to navigate.
