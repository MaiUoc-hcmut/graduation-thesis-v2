const express = require('express');
const router = express.Router();

const ExamController = require('../app/controllers/examController');
const Authorize = require('../app/middleware/authorize');
const CheckingExam = require('../app/middleware/exam');

router.route('/')
    .get(ExamController.getAllExams)
    .post(Authorize.authorizeTeacher, ExamController.createExam);

router.route('/:examId')
    .get(ExamController.getExamById)
    .delete(CheckingExam.checkDeleteExam, ExamController.deleteExam);

router.route('/search/page/:page')
    .get(ExamController.searchExam);

router.route('/full/:examId')
    .get(ExamController.getDetailExam);

router.route('/teacher/:teacherId/page/:page')
    .get(ExamController.getExamCreatedByTeacher);

module.exports = router;