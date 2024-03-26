const express = require('express');
const router = express.Router();

const NotificationController = require('../app/controllers/NotifyController');

router.route('/create-course')
    .get(NotificationController.notifyCreateCourse);

router.route('/create-exam')
    .get(NotificationController.notifyCreateExam);

router.route('/report-error')
    .get(NotificationController.notifyReportErrorOfQuestion);

module.exports = router;

export {}