# Contributing to ReviewCrew

Thanks for your interest in contributing! This is a small, beginner-friendly project — contributions of any size are welcome.

## Getting Started

1. Fork this repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Reviewcrew.git
   cd Reviewcrew
   ```
3. Follow [`SETUP.md`](./SETUP.md) to get the project running locally.
4. Create a new branch for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Ways to Contribute

- **Bug fixes** — if you find something broken, open an issue or submit a fix directly.
- **New agent prompts** — improving the accuracy of the Quality, Bug, or Security agent prompts (see `backend/agents/`).
- **Additional language testing** — help expand [`TESTING.md`](./TESTING.md) with more languages.
- **Accessibility improvements** — this project aims to be usable by everyone.
- **Documentation** — clarifying setup steps, fixing typos, improving examples.

## Code Style

- Plain JavaScript (no TypeScript, no framework) to keep the project approachable.
- Keep functions small and focused — each agent file should do exactly one thing.
- Match the existing code style in the file you're editing.

## Submitting Changes

1. Commit your changes with a clear message:
   ```bash
   git commit -m "Add: brief description of your change"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request against the `main` branch of this repository.
4. Describe what your change does and why.

## Reporting Issues

Found a bug or have a feature idea? Open an issue on GitHub with:
- A clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Any relevant screenshots

## Code of Conduct

Be respectful and constructive. This is a learning project — questions and beginner contributions are just as welcome as advanced ones.
