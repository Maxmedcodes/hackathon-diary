const { Router } = require('express');

const diaryController = require('../controllers/diarycontroller');

const diaryRouter = Router();

diaryRouter.get("/", diaryController.index);
diaryRouter.post("/", diaryController.create);
diaryRouter.get("/:dateorCategory", diaryController.getByDateOrCategory);
diaryRouter.get("/entry/:id", diaryController.show);
diaryRouter.patch("/entry/:id", diaryController.update);
diaryRouter.delete("/entry/:id", diaryController.destroy);

module.exports = diaryRouter;