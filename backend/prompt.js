function buildReviewPrompt(code, language) {
  return `You are a senior software engineer conducting a thorough code review.

Review the following ${language} code and provide structured feedback.

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`

Provide your review in the following JSON format only — no other text before or after:
{
  "summary": "One sentence overall assessment",
  "score": <number 1-10>,
  "issues": [
    {
      "severity": "critical|warning|suggestion",
      "category": "security|performance|quality|best-practice",
      "line": <line number or null>,
      "title": "Short title",
      "description": "Detailed explanation",
      "fix": "How to fix this"
    }
  ],
  "positives": [
    "What the code does well"
  ],
  "refactored_snippet": "Corrected version of the most critical issue or null"
}`;
}

module.exports = { buildReviewPrompt };