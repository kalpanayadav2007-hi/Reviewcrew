# ReviewCrew — API Design

v1.0 has exactly **2 endpoints**, intentionally minimal — matching the PRD's no-accounts, no-history scope. No implementation in this document; design only.

---

## `POST /api/review`

**Purpose:** Submit a code snippet and receive a combined review from the Quality, Bug, and Security agents.

**Authentication:** None — public endpoint, no auth in v1.0.

**Request**
```
Content-Type: application/json

{
  "code": "string (required)"
}
```

**Validation Rules**
- `code` must be present and must be a string.
- `code.trim().length > 0` — reject empty or whitespace-only input.
- `code.length <= 5000` — reject oversized input (prevents slow/costly requests).

**Success Response — `200 OK`**
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
If an agent finds nothing, its `findings` array is empty `[]` — the frontend renders this as "No issues found in this category" (see Blueprint Day 5).

**Error Cases**

| Status | Condition | Response Body |
|---|---|---|
| `400 Bad Request` | `code` missing, not a string, empty/whitespace, or over 5000 chars | `{ "error": "clear, specific message" }` |
| `500 Internal Server Error` | Gemini API call fails, or an unhandled exception occurs | `{ "error": "Something went wrong. Please try again." }` (generic — no stack trace or internal details exposed) |

---

## `GET /api/health`

**Purpose:** Simple uptime/liveness check. Added specifically to de-risk Render's free-tier cold-start behavior (documented risk in PRD Section 9) — lets you confirm the backend is awake before a live demo.

**Authentication:** None

**Request:** No body, no parameters.

**Validation:** None required.

**Success Response — `200 OK`**
```json
{ "status": "ok" }
```

**Error Cases:** None expected under normal operation.

---

## Design Notes
- No endpoint requires authentication — matches PRD's explicit exclusion of user accounts from v1.0.
- No endpoint persists data — matches SCHEMA.md's "no database" decision.
- Both endpoints return JSON exclusively; no HTML rendering happens server-side.
- CORS must be configured on the backend to allow requests from the deployed frontend's origin (finalized Day 9 of the Implementation Blueprint).
