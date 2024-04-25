const express = require('express');
const router = express.Router();

const NotificationController = require('../app/controllers/NotifyController');
const Authorize = require('../app/middleware/authorize');

router.route('/create-course')
    .get(NotificationController.notifyCreateCourse);

router.route('/create-exam')
    .get(NotificationController.notifyCreateExam);

router.route('/create-topic')
    .post(NotificationController.notifyCreateTopic);

router.route('/report-error')
    .post(NotificationController.notifyReportErrorOfQuestion);

router.route('/upload-video')
    .get(NotificationController.notifyUploadVideo);

router.route('/student-buy-course')
    .post(NotificationController.notifyStudentBuyCourse);

router.route('/read-noti')
    .put(NotificationController.readNotification);

router.route('/get-noti/:userId/page/:page')
    .get(NotificationController.getNotificationOfUser);

router.route('/teacher-send')
    .post(Authorize.authorizeTeacher, NotificationController.teacherSendNotification);

router.route('/payment')
    .get(NotificationController.notifyPayment);

module.exports = router;

export {}