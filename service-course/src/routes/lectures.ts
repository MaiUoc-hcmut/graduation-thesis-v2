const express = require('express');
const router = express.Router();

const lectureController = require("../app/controllers/LectureController");

router.put("/:id", lectureController.update);
router.delete("/:id", lectureController.delete);
router.post("/", lectureController.create);
router.get("/:id", lectureController.getLecture);
router.get("/", lectureController.getAllLecture);

module.exports = router;
