const express = require('express');
const router = express.Router();

const AssignmentController = require('../app/controllers/AssignmentController');
const Authorize = require('../app/middleware/authorize');

router.route('/')
    .post(Authorize.verifyStudent, AssignmentController.submitAssignment);

router.route('/full/:assignmentId')
    .get(AssignmentController.getDetailOfAssignment);

router.route('/student/:studentId/page/:page')
    .get(AssignmentController.getAssignmentsOfStudent);

router.route('/exam/:examId/page/:page')
    .get(AssignmentController.getAssignmentsOfExam);

module.exports = router;