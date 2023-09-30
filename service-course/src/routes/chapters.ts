const express = require('express');
const router = express.Router();
const lecturesRouter = require("./lectures");

const chapterController = require("../app/controllers/ChapterController");

///route chapter
router.use("/lectures", lecturesRouter)

router.get("/all", chapterController.getChapterFull);
router.put("/:id", chapterController.update);
router.delete("/:id", chapterController.delete);
router.post("/", chapterController.create);
router.get("/:id", chapterController.getChapter);
router.get("/", chapterController.getAllChapter);

module.exports = router;
