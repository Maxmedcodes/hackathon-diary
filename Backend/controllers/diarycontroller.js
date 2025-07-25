const diary = require('../models/diarymodel');

async function index(req, res) {
  try {
    const diaries = await diary.getAllDiaries();
    res.status(200).json(diaries);
  } catch (err) {
    res.status(500).json({ "error": err.message })
  }
}


module.exports = {
    index,
};