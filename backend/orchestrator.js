const { reviewQuality } = require('./agents/qualityAgent');

async function runReview(code) {
  const quality = await reviewQuality(code);
  return { quality };
}

module.exports = { runReview };