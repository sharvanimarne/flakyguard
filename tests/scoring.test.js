const { computeFlakinessScore, classify, shouldQuarantine } = require("../src/utils/scoring");

describe("computeFlakinessScore", () => {
  test("returns 0 for a consistently passing test", () => {
    expect(computeFlakinessScore(["pass", "pass", "pass", "pass"])).toBe(0);
  });

  test("returns 0 for a consistently failing test", () => {
    expect(computeFlakinessScore(["fail", "fail", "fail"])).toBe(0);
  });

  test("returns 1 for a test that flips every run", () => {
    expect(computeFlakinessScore(["pass", "fail", "pass", "fail"])).toBe(1);
  });

  test("returns a partial score for a test that flips sometimes", () => {
    // 5 results -> 4 possible flips; flips at positions 2 and 4 -> 2/4 = 0.5
    expect(computeFlakinessScore(["pass", "pass", "fail", "fail", "pass"])).toBe(0.5);
  });

  test("returns 0 for fewer than 2 results", () => {
    expect(computeFlakinessScore(["pass"])).toBe(0);
    expect(computeFlakinessScore([])).toBe(0);
  });
});

describe("classify", () => {
  test("classifies 0 as stable", () => {
    expect(classify(0)).toBe("stable");
  });

  test("classifies scores below 0.3 as mostly-stable", () => {
    expect(classify(0.2)).toBe("mostly-stable");
  });

  test("classifies scores between 0.3 and 0.6 as flaky", () => {
    expect(classify(0.5)).toBe("flaky");
  });

  test("classifies scores 0.6 and above as highly-flaky", () => {
    expect(classify(0.8)).toBe("highly-flaky");
  });
});

// --- TDD: new requirement — decide whether a test should be auto-quarantined ---
describe("shouldQuarantine", () => {
  test("returns true when score meets or exceeds the threshold", () => {
    expect(shouldQuarantine(0.6, 0.5)).toBe(true);
    expect(shouldQuarantine(0.5, 0.5)).toBe(true);
  });

  test("returns false when score is below the threshold", () => {
    expect(shouldQuarantine(0.3, 0.5)).toBe(false);
  });

  test("uses a default threshold of 0.5 when none is provided", () => {
    expect(shouldQuarantine(0.7)).toBe(true);
    expect(shouldQuarantine(0.2)).toBe(false);
  });
});
