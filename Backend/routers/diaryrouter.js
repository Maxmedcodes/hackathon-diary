const { Router } = require('express');

const diaryController = require('../controllers/diarycontroller');

const diaryRouter = Router();

diaryRouter.get("/", diaryController.index);
// diaryRouter.get("/:dateorCategory", diaryController.getByDateOrCategory);
diaryRouter.get("/:id", diaryController.show);
diaryRouter.post("/", diaryController.create);
// diaryRouter.delete("/:id", diaryController.destroy);
// diaryRouter.patch("/:id", diaryController.update);

module.exports = diaryRouter;