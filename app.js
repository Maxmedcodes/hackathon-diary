const express = require('express');

const dairyRouter = require('./Backend/routers/diaryrouter');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Dairy App",
    description: "Record and manage your daily diary entries",
  })
})

app.use("/dairy", dairyRouter);

module.exports = app;