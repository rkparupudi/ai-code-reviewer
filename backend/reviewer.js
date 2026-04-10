const { buildReviewPrompt } = require('./prompt');

async function reviewCode(code, language) {
  const prompt = buildReviewPrompt(code, language);

  const requestBody = JSON.stringify({
    model: 'llama3.2',
    prompt: prompt,
    stream: false
  });

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status: ${response.status}`);
    }

    const data = await response.json();
    let text = data.response;

    // Remove markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Extract JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in AI response');
    }

    // Clean control characters that break JSON parsing
    const cleanJson = jsonMatch[0]
      .replace(/[\u0000-\u001F\u007F]/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .trim();

    return JSON.parse(cleanJson);

  } catch (err) {
    throw new Error('Review failed: ' + err.message);
  }
}

module.exports = { reviewCode };