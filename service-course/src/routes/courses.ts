const express = require('express');
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const chaptersRouter = require("./chapters");

const fileUpload = require('../config/firebase/fileUpload');

const Authorize = require('../app/middleware/teacherAuth');
///route chapter
router.use("/chapters", chaptersRouter)

//route course
router.route('/')
    .get(courseController.getAllCourse)
    .post(Authorize.protectedAPI,
        fileUpload.uploadCourseFiles, 
        courseController.uploadThumbnailAndCover, 
        courseController.uploadLectureVideo, 
        courseController.createCourse)

router.route('/:courseId')
    .get(courseController.getCourseById)
    .put(courseController.updateCourse)
    .delete(courseController.deleteCourse);

router.route('/full/:courseId')
    .get(courseController.getAllDetailCourse);

router.route('/teacher/:teacherId')
    .get(Authorize.AuthGetCourseCreatedByTeacher, courseController.getCourseCreatedByTeacher);
router.post("/test", fileUpload.uploadCourseFiles, courseController.test);




module.exports = router;
