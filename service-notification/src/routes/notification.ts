const express = require('express');
const router = express.Router();

const NotificationController = require('../app/controllers/NotifyController');

router.route('/create-course')
    .get(NotificationController.notifyCreateCourse);

router.route('/create-exam')
    .get(NotificationController.notifyCreateExam);

router.route('/report-error')
    .post(NotificationController.notifyReportErrorOfQuestion);

router.route('/upload-video')
    .get(NotificationController.notifyUploadVideo);

router.route('/read-noti')
    .put(NotificationController.readNotification);

router.route('/get-noti/:userId')
    .get(NotificationController.getNotificationOfUser);

router.post('/teacher-send')
    .post(NotificationController.teacherSendNotification)

router.route('/payment')
    .get(NotificationController.notifyPayment);

module.exports = router;

export {}