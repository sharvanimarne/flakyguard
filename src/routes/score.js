const express = require("express");
const router = express.Router();
const { computeFlakinessScore, classify } = require("../utils/scoring");

// POST /score  { results: ["pass","fail","pass","pass","fail"] }
router.post("/score", (req, res) => {
  const { results } = req.body;
  if (!Array.isArray(results)) {
    return res.status(400).json({ error: "results must be an array of 'pass'/'fail'" });
  }
  const score = computeFlakinessScore(results);
  res.json({ score, classification: classify(score) });
});

module.exports = { router };
