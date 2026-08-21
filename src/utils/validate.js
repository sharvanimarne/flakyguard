/**
 * Validates a test-run payload before it is accepted for flakiness analysis.
 * Returns { valid: boolean, errors: string[] }.
 */
function validateTestRun(payload = {}) {
  const errors = [];
  const { commitSha, testName, status } = payload;

  if (!commitSha) errors.push("commitSha is required");
  if (!testName) errors.push("testName is required");
  if (!status) {
    errors.push("status is required");
  } else if (!["pass", "fail"].includes(status)) {
    errors.push("status must be 'pass' or 'fail'");
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateTestRun };
