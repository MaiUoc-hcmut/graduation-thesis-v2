const express = require('express');
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const chaptersRouter = require("./chapters");

const fileUpload = require('../config/firebase/fileUpload.js');
///route chapter
router.use("/chapters", chaptersRouter)

//route course
router.get("/:id/all", courseController.getAllCourseFull);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.delete);
router.post("/", fileUpload.uploadThumbnail, courseController.create);
router.get("/:id", courseController.getCourse);
router.get("/", courseController.getAllCourse);




module.exports = router;
