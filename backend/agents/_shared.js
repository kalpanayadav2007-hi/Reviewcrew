const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractJson(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }
  return cleaned;
}

/**
 * Runs a single-purpose review agent against the given code.
 * @param {string} agentName - used only in error messages/logs (e.g. "Quality Agent")
 * @param {string} systemPrompt - the agent's focused system instruction
 * @param {string} code - the user's submitted code
 */
async function runAgent(agentName, systemPrompt, code) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(code);
    const rawText = result.response.text();
    const jsonText = extractJson(rawText);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error(`${agentName} JSON parse failed. Raw response:`, rawText);
      return { findings: [], error: `Failed to parse ${agentName} response.` };
    }

    if (!parsed.findings || !Array.isArray(parsed.findings)) {
      return { findings: [], error: `${agentName} returned an unexpected shape.` };
    }

    return { findings: parsed.findings };
  } catch (apiErr) {
    console.error(`${agentName} API call failed:`, apiErr.message);
    return { findings: [], error: `${agentName} request failed.` };
  }
}

module.exports = { runAgent };