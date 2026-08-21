const { validateTestRun } = require("../src/utils/validate");

describe("validateTestRun", () => {
  test("returns valid: true for a correct payload", () => {
    const result = validateTestRun({ commitSha: "abc123", testName: "test_login", status: "pass" });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test("flags missing commitSha", () => {
    const result = validateTestRun({ testName: "test_login", status: "pass" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("commitSha is required");
  });

  test("flags missing testName", () => {
    const result = validateTestRun({ commitSha: "abc123", status: "pass" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("testName is required");
  });

  test("flags invalid status value", () => {
    const result = validateTestRun({ commitSha: "abc123", testName: "test_login", status: "maybe" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("status must be 'pass' or 'fail'");
  });

  test("accumulates multiple errors when several fields are invalid", () => {
    const result = validateTestRun({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
