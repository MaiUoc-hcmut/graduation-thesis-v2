const express = require('express');
const router = express.Router();

const StudentController = require('../controllers/studentController');
const Authorize = require('../middleware/studentAuth');
const Photo = require('../../config/firebase/photo');

router.route('/').get(StudentController.getAllStudent);
router.route('/get-student-by-email').get(StudentController.getStudentByEmail);
router.route('/:studentId')
    .get(StudentController.getStudentById)
    .put(Authorize.protectedAPI, StudentController.updateStudent);
router.route('/change-password').put(Authorize.protectedAPI, StudentController.changePassword);
router.route('/forgot-password').post(StudentController.forgotPassword);
router.route('/reset-password/:resetToken').put(StudentController.resetPassword);
router.route('/upload-avatar/:studentId').post(Authorize.protectedAPI, Photo.upload, StudentController.uploadAvatar);

module.exports = router;