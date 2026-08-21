const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "FlakyGuard API running" });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`FlakyGuard listening on port ${PORT}`));
}

const { router: uploadRouter } = require("./src/routes/upload");
app.use("/api", uploadRouter);

const { router: scoreRouter } = require("./src/routes/score");
app.use("/api", scoreRouter);
