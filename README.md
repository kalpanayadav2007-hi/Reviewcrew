# 🔍 ReviewCrew — Multi-Agent AI Code Review

**Live demo:** [https://reviewcrew-frontend.onrender.com](https://reviewcrew-frontend.onrender.com)

ReviewCrew is a free, open-source, multi-agent AI code review tool. Paste any code, in any programming language, and get a structured review from **three independent, specialized AI agents** — Quality, Bug, and Security — each reasoning independently before their findings are combined into one clear report.

Unlike a single chatbot response, ReviewCrew uses a genuine **multi-agent architecture**: three separate AI calls, each with its own focused system prompt, running in parallel and never overlapping in what they report on.

## ✨ Features

- 🔍 **Quality Agent** — readability, naming, structure, anti-patterns
- 🐛 **Bug Agent** — logic errors, edge cases, runtime risks
- 🔒 **Security Agent** — injection risks, unsafe input handling, hardcoded secrets
- 🌍 **Language-agnostic** — works on any programming language, no per-language config
- ⚡ **Parallel execution** — all 3 agents run simultaneously, not sequentially
- 🆓 **100% free to run** — built entirely on free-tier services (Google Gemini API, Render hosting)
- ♿ **Accessible** — screen-reader support, keyboard navigation, color-independent severity indicators

## 🖥️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (no framework, no build step)
- **Backend:** Node.js + Express
- **AI:** Google Gemini API (`gemini-3.6-flash`) via `@google/generative-ai`
- **Hosting:** Render (free tier — Web Service + Static Site)

## 🏗️ Architecture

```
User pastes code
      ↓
Frontend (fetch) → Backend (/api/review)
      ↓
Orchestrator triggers 3 parallel agent calls:
   ├── Quality Agent  → Gemini API
   ├── Bug Agent      → Gemini API
   └── Security Agent → Gemini API
      ↓
Combined JSON response
      ↓
Rendered as 3 labeled sections in the browser
```

Full technical details: see [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`API.md`](./API.md), and [`PROJECT-STRUCTURE.md`](./PROJECT-STRUCTURE.md).

## 🚀 Getting Started (Run Locally)

See [`SETUP.md`](./SETUP.md) for full step-by-step instructions. Quick version:

```bash
git clone https://github.com/kalpanayadav2007-hi/Reviewcrew.git
cd Reviewcrew/backend
npm install
# Create a .env file with your free Gemini API key (see .env.example)
npm start
```

Then open `frontend/index.html` in your browser.

Get a free Gemini API key (no credit card required) at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## 🧪 Testing

See [`TESTING.md`](./TESTING.md) for the full manual QA log, including cross-language testing (JavaScript, Python, Java) and edge case coverage.

## 🤝 Contributing

Contributions are welcome! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

## 🗺️ Roadmap / Future Scope

- GitHub PR integration — review a pull request directly instead of pasting code
- CLI version — review code from the terminal
- Support for reviewing multiple files / a full repository
- Optional review history (would require adding a database — intentionally out of scope for v1.0)

## 📄 License

MIT — see [`LICENSE`](./LICENSE)

## 🙏 Acknowledgments

Built as a 10-day capstone project for the **AB Talks 60-Day Claude AI Challenge**, using Claude as a technical co-pilot throughout planning, architecture, implementation, and debugging.
