const express = require('express');
const router = express.Router();

const TeacherInformationController = require('../app/controllers/TeacherInformationController');

router.route('/teacher/:teacherId')
    .get(TeacherInformationController.getCourseServiceInformation);

module.exports = router;