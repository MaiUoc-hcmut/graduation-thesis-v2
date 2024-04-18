const express = require('express');
const router = express.Router();

const AssignmentController = require('../app/controllers/AssignmentController');
const Authorize = require('../app/middleware/authorize');
const CheckingAssignment = require('../app/middleware/assignment');

router.route('/')
    .post(Authorize.verifyStudent, AssignmentController.submitAssignment);

router.route('/page/:page')
    .get(AssignmentController.getAllAssignments)

router.route('/full/:assignmentId')
    .get(Authorize.verifyUser, CheckingAssignment.checkGetAssignmentsOfStudent, AssignmentController.getDetailOfAssignment);

router.route('/student/:studentId/page/:page')
    .get(Authorize.verifyUser, CheckingAssignment.checkGetAssignmentsOfStudent, AssignmentController.getAssignmentsOfStudent);

router.route('/teacher/:teacherId/page/:page')
    .get(Authorize.verifyUser, CheckingAssignment.checkGetAssignmentsOfExamsOfTeacher, AssignmentController.getAssignmentsOfExamsOfTeacher);

router.route('/student/:studentId/exam/:examId/page/:page')
    .get(Authorize.verifyUser, CheckingAssignment.checkGetAssignmentsOfStudent, AssignmentController.getAssignmentsOfStudentOfExam);

router.route('/exam/:examId/page/:page')
    .get(Authorize.verifyUser, CheckingAssignment.checkGetAssignmentsOfExam, AssignmentController.getAssignmentsOfExam);

module.exports = router;