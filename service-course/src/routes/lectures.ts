const express = require('express');
const router = express.Router();
const fileUpload = require('../config/firebase/fileUpload');

const lectureController = require("../app/controllers/LectureController");

router.route('/')
    .get(lectureController.getAllLectures)
    // .post(fileUpload.uploadCourseFiles, lectureController.uploadLectureVideo, lectureController.createLecture);

router.route('/:lectureId')
    .get(lectureController.getLectureById)
    .put(lectureController.updateLecture)
    .delete(lectureController.deleteLecture);

router.route('/test')
    .post(fileUpload.uploadVideo, lectureController.test);
module.exports = router;
