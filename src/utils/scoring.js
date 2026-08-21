/**
 * Computes a flakiness score for a test based on its pass/fail history
 * across multiple runs of (ideally) the same commit.
 *
 * Score ranges from 0 (perfectly stable) to 1 (maximally flaky).
 * A test that alternates between pass/fail scores closer to 1.
 * A test that is always pass or always fail scores 0.
 */
function computeFlakinessScore(results) {
  if (!Array.isArray(results) || results.length < 2) {
    return 0;
  }

  let flips = 0;
  for (let i = 1; i < results.length; i++) {
    if (results[i] !== results[i - 1]) {
      flips++;
    }
  }

  // Normalize by max possible flips (n - 1)
  const maxFlips = results.length - 1;
  return Number((flips / maxFlips).toFixed(2));
}

function classify(score) {
  if (score === 0) return "stable";
  if (score < 0.3) return "mostly-stable";
  if (score < 0.6) return "flaky";
  return "highly-flaky";
}

module.exports = { computeFlakinessScore, classify };
