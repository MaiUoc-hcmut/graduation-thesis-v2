const express = require('express');
const router = express.Router();
const reviewController = require("../app/controllers/ReviewController");
const Authorize = require('../app/middleware/authorize');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(Authorize.verifyStudent, reviewController.createReview);

router.route('/:reviewId')
    .get(reviewController.getReviewById)
    .delete(reviewController.deleteReview);

router.route('/student/:studentId/page/:page')
    .get(reviewController.getReviewsBelongToStudent);

router.route('/teacher/:teacherId/page/:page')
    .get(reviewController.getReviewsForTeacher);

router.route('/course/:courseId/page/:page')
    .get(reviewController.getReviewsForCourse);

router.route('/exam/:examId/page/:page')
    .get(reviewController.getReviewsForExam);

module.exports = router;