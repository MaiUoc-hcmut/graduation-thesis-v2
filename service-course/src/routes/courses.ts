const express = require('express');
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const chaptersRouter = require("./chapters");

const fileUpload = require('../config/firebase/fileUpload');
const Authorize = require('../app/middleware/authorize');
const CheckingCourse = require('../app/middleware/course');

///route chapter
router.use("/chapters", chaptersRouter)

//route course
router.route('/')
    .get(courseController.getAllCourse)
    .post(Authorize.protectedAPI, courseController.createCourse)


router.route('/filter/page/:page')
    .get(courseController.getCourseFilterByCategory);

router.route('/search/page/:page')
    .post(courseController.searchCourse);

router.route('/search/teacher/:teacherId/page/:page')
    .get(Authorize.verifyUser, CheckingCourse.checkSearchCourseOfTeacher, courseController.searchCourseOfTeacher);

router.route('/:courseId')
    .get(courseController.getCourseById)
    .put(Authorize.authorizeTeacher, CheckingCourse.checkModifyCourse, courseController.updateCourse)
    .delete(Authorize.authorizeTeacher, CheckingCourse.checkModifyCourse, courseController.deleteCourse);

router.route('/full/:courseId')
    .get(courseController.getAllDetailCourse);

router.route('/teacher/:teacherId/page/:page')
    .get(Authorize.authorizeTeacher, courseController.getCourseCreatedByTeacher);

router.post("/test", fileUpload.uploadCourseFiles, courseController.test);




module.exports = router;
