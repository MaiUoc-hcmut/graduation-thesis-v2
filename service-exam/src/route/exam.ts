const examExpress = require('express');
const router = examExpress.Router();

const ExamController = require('../app/controller/examController');

router.route('/')
    .get(ExamController.getAllExams)
    .post(ExamController.createExam);

router.route('/:examId')
    .get(ExamController.getExamById)
    .delete(ExamController.deleteExam);

router.route('/teacher/:teacherId')
    .get(ExamController.getExamCreatedByTeacher);

module.exports = router;