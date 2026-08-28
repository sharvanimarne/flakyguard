const express = require("express");
const router = express.Router();
const { validateTestRun } = require("../utils/validate");

// In-memory store of test run results (for demo purposes)
const testRuns = [];

// POST /upload-results
// Accepts JUnit-style test run results from CI:
// { commitSha, testName, status: "pass" | "fail", timestamp }
router.post("/upload-results", (req, res) => {
  const { valid, errors } = validateTestRun(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const { commitSha, testName, status, timestamp } = req.body;
  const run = { commitSha, testName, status, timestamp: timestamp || Date.now() };
  testRuns.push(run);
  return res.status(201).json({ message: "Test run recorded", run });
});

router.get("/runs", (req, res) => {
  res.json({ count: testRuns.length, runs: testRuns });
});

module.exports = { router, testRuns };
