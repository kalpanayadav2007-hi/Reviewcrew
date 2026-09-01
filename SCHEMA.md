# ReviewCrew — Data/Schema Design

## Status: No Database in v1.0

Per the approved PRD (Section 5.2 — Explicitly Out of Scope), ReviewCrew v1.0 has **no persistence layer**:
- No user accounts
- No saved review history
- No database of any kind

Every request is fully stateless: code submitted → reviewed by 3 agents → response returned → nothing stored server-side.

## Validation Against PRD User Stories

| User Story (from PRD) | Requires Storage? | Notes |
|---|---|---|
| User pastes code and gets a multi-agent review | No | Fully request/response, no persistence needed |
| User sees categorized findings (Quality/Bugs/Security) | No | Returned directly in the API response, rendered client-side |
| User can review multiple snippets in a session | No | Each request is independent; no session state needed |

No PRD user story requires retrieving, listing, or comparing past reviews. A schema is therefore unnecessary for v1.0.

## Response Data Shape (for reference — not a database schema)

Although there is no database, the API response has a consistent structured shape worth documenting here since it plays the same "data contract" role a schema would:

```json
{
  "quality": {
    "findings": [
      { "issue": "string", "explanation": "string", "severity": "low | medium | high" }
    ]
  },
  "bugs": {
    "findings": [
      { "issue": "string", "explanation": "string", "severity": "low | medium | high" }
    ]
  },
  "security": {
    "findings": [
      { "issue": "string", "explanation": "string", "severity": "low | medium | high" }
    ]
  }
}
```

## Future Schema (Documented, Not Built)

If a future version adds saved review history (explicitly out of scope for this capstone), a minimal schema would look like:

```
reviews
├── id            (primary key)
├── code_snippet  (text)
├── quality_findings   (json)
├── bug_findings       (json)
├── security_findings  (json)
└── created_at    (timestamp)
```

This is included only for roadmap/future-scope reference in the Pitch Deck — it is **not** part of the v1.0 build.
