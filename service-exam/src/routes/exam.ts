const express = require('express');
const router = express.Router();

const ExamController = require('../app/controllers/examController');
const Authorize = require('../app/middleware/authorize');
const CheckingExam = require('../app/middleware/exam');

const FileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .post(Authorize.authorizeTeacher, ExamController.createExam);

router.route('/combo')
    .post(
        Authorize.authorizeTeacher, 
        FileUpload.uploadComboFiles,
        ExamController.uploadThumbnailAndCover,
        ExamController.createComboExam
    );

router.route('/page/:page')
    .get(
        Authorize.checkGetAll, 
        Authorize.verifyUser, 
        ExamController.getAllExams
    );

router.route('/:examId')
    .get(ExamController.getExamById)
    .put(
        Authorize.authorizeTeacher, 
        CheckingExam.checkModifyExam, 
        ExamController.updateExam
    )
    .delete(
        Authorize.authorizeTeacher, 
        CheckingExam.checkModifyExam, 
        ExamController.deleteExam
    );

router.route('/search/page/:page')
    .get(
        Authorize.checkGetAll, 
        Authorize.verifyUser, 
        ExamController.searchExam
    );

router.route('/full/:examId')
    .get(ExamController.getDetailExam);

router.route('/teacher/:teacherId/page/:page')
    .get(
        Authorize.checkGetAll, 
        Authorize.verifyUser, 
        CheckingExam.checkGetExamCreatedByTeacher, 
        ExamController.getExamCreatedByTeacher
    );

router.route('/combo/teacher/:teacherId/page/:page')
    .get(
        Authorize.checkGetAll,
        Authorize.verifyUser,
        CheckingExam.checkGetExamCreatedByTeacher,
        ExamController.getComboCreatedByTeacher
    )

module.exports = router;
export {}