const diary = require('../models/diarymodel');

async function index(req, res) {
  try {
    const diaries = await diary.getAllDiaries();
    res.status(200).json(diaries);
  } catch (err) {
    res.status(500).json({ "error": err.message })
  }
}

async function create(req, res) {
  try {
    const data = req.body;
    const diaryEntry = await diary.createDiary(data);
    res.status(201).json(diaryEntry);
  } catch (err) {
    res.status(400).json({ "error": err.message })
  }
}

module.exports = {
    index,
    create,
};