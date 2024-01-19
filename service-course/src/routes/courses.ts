const express = require('express');
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const chaptersRouter = require("./chapters");

const fileUpload = require('../config/firebase/fileUpload');

const Authorize = require('../app/middleware/teacherAuth');
///route chapter
router.use("/chapters", chaptersRouter)

//route course
router.get("/:id/all", courseController.getAllCourseFull);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.delete);
router.post("/", Authorize.protectedAPI, fileUpload.uploadCourseFiles, courseController.uploadThumbnailAndCover, courseController.createCourse);
router.get("/:id", courseController.getCourseById);
router.get("/", courseController.getAllCourse);
// router.post("/test", fileUpload.uploadCourseFiles, courseController.test);




module.exports = router;
