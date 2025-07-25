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

async function show(req, res) {
  try {
    const id = parseInt(req.params.id);
    const diaryEntry = await diary.getEntryById(id);
    res.status(200).json(diaryEntry);
  } catch (err) {
    res.status(404).json({ "error": err.message })
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const diaryEntry = await diary.getEntryById(id);
    const result = await diaryEntry.update(data);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ "error": err.message })
  }
}

async function getByDateOrCategory(req, res) {
  try {
    const param = req.params.dateorCategory;
    
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    
    let diaryEntries;
    if (dateRegex.test(param)) {
      const [day, month, year] = param.split('-');
      const dbDate = `${year}-${month}-${day}`;
      diaryEntries = await diary.getEntriesByDate(dbDate);
    } else {
      diaryEntries = await diary.getEntriesByCategory(param);
    }
    
    res.status(200).json(diaryEntries);
  } catch (err) {
    res.status(404).json({ "error": err.message });
  }
}

module.exports = {
    index,
    create,
    show,
    update,
    getByDateOrCategory
};