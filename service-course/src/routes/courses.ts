const express = require('express');
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const chaptersRouter = require("./chapters");

const fileUpload = require('../config/firebase/fileUpload');

const Authorize = require('../app/middleware/authorize');
///route chapter
router.use("/chapters", chaptersRouter)

//route course
router.route('/')
    .get(courseController.getAllCourse)
    .post(Authorize.protectedAPI,
        // fileUpload.uploadCourseFiles, 
        // courseController.uploadThumbnailAndCover, 
        // courseController.uploadLectureVideo, 
        courseController.createCourse)


router.route('/filter')
    .get(courseController.getCourseFilterByCategory);

router.route('/:courseId')
    .get(courseController.getCourseById)
    .put(Authorize.authorizeTeacher, courseController.updateCourse)
    .delete(Authorize.authorizeTeacher, courseController.deleteCourse);

router.route('/full/:courseId')
    .get(courseController.getAllDetailCourse);

router.route('/teacher/:teacherId')
    .get(Authorize.authorizeTeacher, courseController.getCourseCreatedByTeacher);
router.post("/test", fileUpload.uploadCourseFiles, courseController.test);




module.exports = router;
