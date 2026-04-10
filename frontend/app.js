async function submitReview() {
  const code = document.getElementById('codeInput').value.trim();
  const language = document.getElementById('language').value;
  const btn = document.getElementById('reviewBtn');

  if (!code) {
    alert('Please paste some code first');
    return;
  }

  // Show loading
  btn.disabled = true;
  btn.textContent = 'Analysing...';
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');

  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Review failed');
    }

    renderResults(data.review);

  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Review Code';
    document.getElementById('loading').classList.add('hidden');
  }
}

function renderResults(review) {
  // Score
  const scoreValue = document.getElementById('scoreValue');
  scoreValue.textContent = review.score + '/10';
  scoreValue.className = 'score-value ' + getScoreClass(review.score);

  // Summary
  document.getElementById('summary').textContent = review.summary;

  // Issues
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  if (review.issues && review.issues.length > 0) {
    review.issues.forEach(issue => {
      const card = document.createElement('div');
      card.className = `issue-card ${issue.severity}`;
      card.innerHTML = `
        <div class="issue-header">
          <span class="severity-badge ${issue.severity}">${issue.severity.toUpperCase()}</span>
          <span class="category-badge">${issue.category}</span>
          ${issue.line ? `<span class="line-badge">Line ${issue.line}</span>` : ''}
        </div>
        <h3>${issue.title}</h3>
        <p>${issue.description}</p>
        <div class="fix-section">
          <strong>Fix:</strong> ${issue.fix}
        </div>
      `;
      issuesList.appendChild(card);
    });
  } else {
    issuesList.innerHTML = '<p class="no-issues">No issues found! 🎉</p>';
  }

  // Positives
  const positivesList = document.getElementById('positivesList');
  positivesList.innerHTML = '';
  (review.positives || []).forEach(positive => {
    const li = document.createElement('li');
    li.textContent = positive;
    positivesList.appendChild(li);
  });

  // Refactored snippet
  const refactoredSection = document.getElementById('refactoredSection');
  if (review.refactored_snippet) {
    document.getElementById('refactoredCode').textContent = review.refactored_snippet;
    refactoredSection.classList.remove('hidden');
  } else {
    refactoredSection.classList.add('hidden');
  }

  // Show results
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function getScoreClass(score) {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'fair';
  return 'poor';
}

function clearAll() {
  document.getElementById('codeInput').value = '';
  document.getElementById('results').classList.add('hidden');
}