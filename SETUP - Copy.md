# ReviewCrew — Setup Guide

This document lets anyone (including future-you) get this project running locally from a fresh clone.

## Prerequisites
- **Node.js** (v18 or higher recommended; developed on v22.23.1) — the JavaScript runtime that runs the backend.
- **npm** (bundled with Node.js) — the package manager used to install dependencies.
- **Git** — for version control.
- **A Google Gemini API key** — required for the AI agents to function. Get one free, no card required, at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
- **VS Code** (recommended) with the **ESLint** and **DotENV** extensions for a smoother dev experience.

## 1. Clone the Repository
```bash
git clone https://github.com/kalpanayadav2007-hi/Reviewcrew.git
cd Reviewcrew
```

## 2. Backend Setup
```bash
cd backend
npm install
```
This installs: `express`, `cors`, `dotenv`, `@google/generative-ai`.

## 3. Environment Variables
1. Copy `.env.example` to a new file named `.env` in the `backend/` folder.
2. Open `.env` and add your real Gemini API key:
   ```
   GEMINI_API_KEY=AIza-your-real-key-here
   ```
3. **Never commit `.env`** — it's already excluded via `.gitignore`.

See `ENVIRONMENT.md` for the full list of environment variables and what each one does.

## 4. Run the Backend
```bash
npm start
```
This runs `node server.js`. You should see:
```
ReviewCrew backend listening on port 3000
```

Verify it's working by visiting:
- `http://localhost:3000` → should show a "backend is running" message
- `http://localhost:3000/api/health` → should show `{"status":"ok"}`

## 5. Run the Frontend
No build step needed — it's plain HTML/CSS/JS.

1. Navigate to the `frontend/` folder in File Explorer.
2. Double-click `index.html` to open it in your browser (or use VS Code's "Live Server" extension if installed).
3. Confirm the page loads and shows **"Backend connected ✅ (status: ok)"** — this confirms frontend and backend are correctly wired.

**Note:** the backend must be running (Step 4) for the frontend to show a successful connection.

## Known Quirks
- The `dotenv` package prints a promotional "tip" message to the console by default on every run. This is silenced in this project via `require('dotenv').config({ quiet: true })` in `server.js` — no action needed, but worth knowing if you see it return after future dotenv updates.

## Branching Strategy
- `main` — always stable, deployable code.
- `dev` — daily development work happens here; merged into `main` only at tested milestones.

## Troubleshooting
| Problem | Likely Cause |
|---|---|
| `Backend NOT connected ❌` on the frontend | Backend server isn't running — run `npm start` in `backend/` |
| `npm start` fails with a missing module error | Run `npm install` again inside `backend/` |
| CORS error in browser console | Confirm `cors()` middleware is active in `server.js` (should be, by default) |
| "API key not valid" errors | Confirm `.env` exists in `backend/` (not the project root), contains `GEMINI_API_KEY=`, and the key was copied fresh from aistudio.google.com (no extra spaces/quotes) |
