const { runAgent } = require('./_shared');

const SYSTEM_PROMPT = `You are a senior application security reviewer. Look ONLY for security issues: injection risks, unsafe input handling, hardcoded secrets/credentials, insecure use of eval or similar, unsafe deserialization, and unvalidated external input, regardless of programming language. Ignore style, naming, formatting, and general logic bugs — those are handled by other reviewers. Focus only on security.

Respond ONLY with valid JSON in exactly this shape, and nothing else (no markdown, no code fences, no explanation outside the JSON):
{
  "findings": [
    { "issue": "short issue title", "explanation": "1-2 sentence explanation", "severity": "low" }
  ]
}

If the code has no security issues, return { "findings": [] }.
Severity must be exactly one of: "low", "medium", "high".`;

async function reviewSecurity(code) {
  return runAgent('Security Agent', SYSTEM_PROMPT, code);
}

module.exports = { reviewSecurity };