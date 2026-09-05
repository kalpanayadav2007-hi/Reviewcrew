const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a senior application security reviewer. Look ONLY for security issues: injection risks, unsafe input handling, hardcoded secrets/credentials, insecure use of eval or similar, unsafe deserialization, and unvalidated external input, regardless of programming language. Ignore style, naming, formatting, and general logic bugs — those are handled by other reviewers. Focus only on security.

Respond ONLY with valid JSON in exactly this shape, and nothing else (no markdown, no code fences, no explanation outside the JSON):
{
  "findings": [
    { "issue": "short issue title", "explanation": "1-2 sentence explanation", "severity": "low" }
  ]
}

If the code has no security issues, return { "findings": [] }.
Severity must be exactly one of: "low", "medium", "high".`;

function extractJson(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }
  return cleaned;
}

async function reviewSecurity(code) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(code);
    const rawText = result.response.text();
    const jsonText = extractJson(rawText);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error('Security Agent JSON parse failed. Raw response:', rawText);
      return { findings: [], error: 'Failed to parse Security Agent response.' };
    }

    if (!parsed.findings || !Array.isArray(parsed.findings)) {
      return { findings: [], error: 'Security Agent returned an unexpected shape.' };
    }

    return { findings: parsed.findings };
  } catch (apiErr) {
    console.error('Security Agent API call failed:', apiErr.message);
    return { findings: [], error: 'Security Agent request failed.' };
  }
}

module.exports = { reviewSecurity };