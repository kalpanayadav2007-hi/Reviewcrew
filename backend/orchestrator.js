const { reviewQuality } = require('./agents/qualityAgent');
const { reviewBugs } = require('./agents/bugAgent');
const { reviewSecurity } = require('./agents/securityAgent');

async function runReview(code) {
  const [quality, bugs, security] = await Promise.all([
    reviewQuality(code),
    reviewBugs(code),
    reviewSecurity(code),
  ]);

  return { quality, bugs, security };
}

module.exports = { runReview };