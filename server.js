const express = require("express");
const app = express();
app.use(express.json());

const { router: uploadRouter } = require("./src/routes/upload");
const { router: scoreRouter } = require("./src/routes/score");
const { router: authRouter } = require("./src/routes/auth");

app.get("/", (req, res) => {
  res.json({ status: "FlakyGuard API is live and healthy" });
});

app.use("/api", uploadRouter);
app.use("/api", scoreRouter);
app.use("/api", authRouter);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`FlakyGuard listening on port ${PORT}`));
}
