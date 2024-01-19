const express = require('express');
const router = express.Router();
const fileUpload = require('../config/firebase/fileUpload');

const lectureController = require("../app/controllers/LectureController");

router.put("/:id", lectureController.update);
router.delete("/:id", lectureController.delete);
router.post("/", fileUpload.uploadVideo, lectureController.create);
router.get("/:id", lectureController.getLecture);
router.get("/", lectureController.getAllLecture);

module.exports = router;
