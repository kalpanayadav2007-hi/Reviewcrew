const BACKEND_URL = 'http://localhost:3000';

const codeInput = document.getElementById('codeInput');
const inputMessage = document.getElementById('inputMessage');
const reviewBtn = document.getElementById('reviewBtn');
const retryBtn = document.getElementById('retryBtn');
const newReviewBtn = document.getElementById('newReviewBtn');

const inputPanel = document.getElementById('inputPanel');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const resultsState = document.getElementById('resultsState');
const errorMessage = document.getElementById('errorMessage');

const qualityFindings = document.getElementById('qualityFindings');
const bugFindings = document.getElementById('bugFindings');
const securityFindings = document.getElementById('securityFindings');

const MAX_CHARS = 5000;

function setState(state) {
  inputPanel.style.display = state === 'idle' ? 'block' : 'none';
  loadingState.style.display = state === 'loading' ? 'block' : 'none';
  errorState.style.display = state === 'error' ? 'block' : 'none';
  resultsState.style.display = state === 'results' ? 'block' : 'none';
}

function showInputMessage(text) {
  inputMessage.textContent = text;
  inputMessage.style.display = 'block';
}

function clearInputMessage() {
  inputMessage.style.display = 'none';
  inputMessage.textContent = '';
}

function renderFindingsList(listEl, findings) {
  listEl.innerHTML = '';

  if (!findings || findings.length === 0) {
    const li = document.createElement('li');
    li.className = 'no-issues';
    li.textContent = 'No issues found in this category.';
    listEl.appendChild(li);
    return;
  }

  findings.forEach((finding) => {
    const li = document.createElement('li');

    const severity = (finding.severity || 'low').toLowerCase();
    const badge = document.createElement('span');
    badge.className = `severity-badge severity-${severity}`;
    badge.textContent = severity;

    const issueDiv = document.createElement('div');
    issueDiv.className = 'finding-issue';
    issueDiv.appendChild(badge);
    issueDiv.appendChild(document.createTextNode(finding.issue || 'Untitled issue'));

    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'finding-explanation';
    explanationDiv.textContent = finding.explanation || '';

    li.appendChild(issueDiv);
    li.appendChild(explanationDiv);
    listEl.appendChild(li);
  });
}

function renderResults(data) {
  renderFindingsList(qualityFindings, data.quality && data.quality.findings);
  renderFindingsList(bugFindings, data.bugs && data.bugs.findings);
  renderFindingsList(securityFindings, data.security && data.security.findings);
  setState('results');
}

async function submitReview() {
  const code = codeInput.value;
  const trimmed = code.trim();

  clearInputMessage();

  if (trimmed.length === 0) {
    showInputMessage('Paste some code first.');
    return;
  }

  if (trimmed.length > MAX_CHARS) {
    showInputMessage(`Code is too long (${trimmed.length} characters). Please limit to ${MAX_CHARS} characters.`);
    return;
  }

  reviewBtn.disabled = true;
  setState('loading');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${BACKEND_URL}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: trimmed }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Server returned an error.');
    }

    const data = await response.json();
    renderResults(data);
  } catch (err) {
    let msg = 'Something went wrong. Please check your connection and try again.';
    if (err.name === 'AbortError') {
      msg = 'The request took too long. Please try again.';
    } else if (err.message) {
      msg = err.message;
    }
    errorMessage.textContent = msg;
    setState('error');
  } finally {
    reviewBtn.disabled = false;
  }
}

reviewBtn.addEventListener('click', submitReview);
retryBtn.addEventListener('click', () => setState('idle'));
newReviewBtn.addEventListener('click', () => {
  codeInput.value = '';
  clearInputMessage();
  setState('idle');
});

setState('idle');