const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a senior engineer focused exclusively on finding bugs and logic errors. Look for incorrect logic, unhandled edge cases, off-by-one errors, null/undefined risks, and runtime failure points, regardless of programming language. Ignore style, naming, formatting, and security concerns — those are handled by other reviewers. Focus only on functional correctness.

Respond ONLY with valid JSON in exactly this shape, and nothing else (no markdown, no code fences, no explanation outside the JSON):
{
  "findings": [
    { "issue": "short issue title", "explanation": "1-2 sentence explanation", "severity": "low" }
  ]
}

If the code has no bugs, return { "findings": [] }.
Severity must be exactly one of: "low", "medium", "high".`;

function extractJson(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }
  return cleaned;
}

async function reviewBugs(code) {
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
      console.error('Bug Agent JSON parse failed. Raw response:', rawText);
      return { findings: [], error: 'Failed to parse Bug Agent response.' };
    }

    if (!parsed.findings || !Array.isArray(parsed.findings)) {
      return { findings: [], error: 'Bug Agent returned an unexpected shape.' };
    }

    return { findings: parsed.findings };
  } catch (apiErr) {
    console.error('Bug Agent API call failed:', apiErr.message);
    return { findings: [], error: 'Bug Agent request failed.' };
  }
}

module.exports = { reviewBugs };