const express = require("express");
const router = express.Router();

// In-memory demo user store (for demo purposes only — never do this in production)
const users = [{ username: "admin", password: "admin123" }];

// POST /login  { username, password }
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Demo token (not a real JWT) — placeholder for real auth implementation
  return res.json({ message: "Login successful", token: `demo-token-${username}` });
});

module.exports = { router };
