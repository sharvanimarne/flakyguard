const request = require("supertest");
const app = require("../server");

describe("Integration Workflow 1: Test-run upload -> retrieval -> flakiness scoring", () => {
  test("uploading a valid test run returns 201 and the run appears in GET /api/runs", async () => {
    const uploadRes = await request(app)
      .post("/api/upload-results")
      .send({ commitSha: "abc123", testName: "test_checkout_flow", status: "pass" });

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.run.testName).toBe("test_checkout_flow");

    const runsRes = await request(app).get("/api/runs");
    expect(runsRes.status).toBe(200);
    expect(runsRes.body.count).toBeGreaterThanOrEqual(1);
    expect(runsRes.body.runs.some(r => r.testName === "test_checkout_flow")).toBe(true);
  });

  test("uploading an invalid test run (missing fields) is rejected with 400 and validation errors", async () => {
    const res = await request(app)
      .post("/api/upload-results")
      .send({ testName: "test_missing_fields" }); // missing commitSha and status

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain("commitSha is required");
    expect(res.body.errors).toContain("status is required");
  });

  test("scoring a flip-flopping test history via POST /api/score returns a flaky classification", async () => {
    const res = await request(app)
      .post("/api/score")
      .send({ results: ["pass", "fail", "pass", "fail"] });

    expect(res.status).toBe(400);
    expect(res.body.score).toBe(1);
    expect(res.body.classification).toBe("highly-flaky");
  });
});

describe("Integration Workflow 2: User authentication (login)", () => {
  test("valid credentials return a token and success message", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "admin123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBe("demo-token-admin");
  });

  test("invalid credentials are rejected with 401", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});
