const express = require('express');
const cors = require('cors');

const dairyRouter = require('./Backend/routers/diaryrouter');
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Diary App",
    description: "Record and manage your daily diary entries",
  })
})

app.use("/diary", dairyRouter);

module.exports = app;