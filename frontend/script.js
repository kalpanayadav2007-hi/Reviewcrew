const BACKEND_URL = 'https://reviewcrew-backend.onrender.com';

const codeInput = document.getElementById('codeInput');
const inputMessage = document.getElementById('inputMessage');
const charCounter = document.getElementById('charCounter');
const reviewBtn = document.getElementById('reviewBtn');
const exampleBtn = document.getElementById('exampleBtn');
const retryBtn = document.getElementById('retryBtn');
const newReviewBtn = document.getElementById('newReviewBtn');

const inputPanel = document.getElementById('inputPanel');
const loadingState = document.getElementById('loadingState');
const loadingText = document.getElementById('loadingText');
const errorState = document.getElementById('errorState');
const resultsState = document.getElementById('resultsState');
const errorMessage = document.getElementById('errorMessage');
const liveRegion = document.getElementById('liveRegion');

const qualityFindings = document.getElementById('qualityFindings');
const bugFindings = document.getElementById('bugFindings');
const securityFindings = document.getElementById('securityFindings');

const MAX_CHARS = 5000;
const TIMEOUT_MS = 55000; // generous, to tolerate Render free-tier cold starts

const EXAMPLE_CODE = `function getUser(id){var query='SELECT * FROM users WHERE id='+id; var arr=[1,2,3]; for(var i=0;i<=arr.length;i++){console.log(arr[i]);}}`;

function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

function announce(text) {
  liveRegion.textContent = text;
}

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

function updateCharCounter() {
  const len = codeInput.value.length;
  charCounter.textContent = `${len} / ${MAX_CHARS}`;
  charCounter.classList.toggle('char-counter-warning', len > MAX_CHARS);
}

function renderFindingsList(listEl, findings) {
  listEl.innerHTML = '';

  if (!findings || findings.length === 0) {
    const li = document.createElement('li');
    li.className = 'no-issues';
    li.textContent = '✓ No issues found in this category.';
    listEl.appendChild(li);
    return;
  }

  findings.forEach((finding) => {
    const li = document.createElement('li');

    const severity = (finding.severity || 'low').toLowerCase();
    const severityLabel = { high: '● High', medium: '◐ Medium', low: '○ Low' }[severity] || '○ Low';

    const badge = document.createElement('span');
    badge.className = `severity-badge severity-${severity}`;
    badge.textContent = severityLabel;

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
  announce('Review complete. Results are now displayed below.');
}

async function submitReview() {
  const code = codeInput.value;
  const trimmed = code.trim();

  clearInputMessage();
    if (isOffline()) {
    showInputMessage('You appear to be offline. Please check your internet connection.');
    return;
  }

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
  loadingText.textContent = 'Running 3 AI agents on your code...';
  announce('Running review, please wait.');

  const slowNoticeTimer = setTimeout(() => {
    loadingText.textContent = 'Still working — the server may be waking up from idle. This can take up to 45 seconds on the free tier.';
  }, 8000);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BACKEND_URL}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: trimmed }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    clearTimeout(slowNoticeTimer);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Server returned an error.');
    }

    const data = await response.json();
    renderResults(data);
  } catch (err) {
    clearTimeout(slowNoticeTimer);
    let msg = 'Something went wrong. Please check your connection and try again.';
    if (err.name === 'AbortError') {
      msg = 'The server took too long to respond. It may be waking up from idle — please try again in a moment.';
    } else if (err.message) {
      msg = err.message;
    }
    errorMessage.textContent = msg;
    setState('error');
    announce('An error occurred: ' + msg);
  } finally {
    reviewBtn.disabled = false;
  }
}

// Tab key inserts a tab character instead of moving focus
codeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = codeInput.selectionStart;
    const end = codeInput.selectionEnd;
    codeInput.value = codeInput.value.substring(0, start) + '\t' + codeInput.value.substring(end);
    codeInput.selectionStart = codeInput.selectionEnd = start + 1;
    updateCharCounter();
  }
});

codeInput.addEventListener('input', updateCharCounter);

reviewBtn.addEventListener('click', submitReview);
retryBtn.addEventListener('click', () => setState('idle'));
newReviewBtn.addEventListener('click', () => {
  codeInput.value = '';
  clearInputMessage();
  updateCharCounter();
  setState('idle');
  codeInput.focus();
});
exampleBtn.addEventListener('click', () => {
  codeInput.value = EXAMPLE_CODE;
  updateCharCounter();
  clearInputMessage();
  codeInput.focus();
});

updateCharCounter();
setState('idle');