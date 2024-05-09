const express = require('express');
const router = express.Router();

const ComboController = require('../app/controllers/ComboController');
const Authorize = require('../app/middleware/authorize');
const CheckingExam = require('../app/middleware/exam');
const CheckingCombo = require('../app/middleware/combo');

const FileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .post(
        Authorize.authorizeTeacher, 
        CheckingCombo.checkCreateCombo,
        FileUpload.uploadComboFiles,
        ComboController.uploadThumbnailAndCover,
        ComboController.createComboExam
    );

router.route('/:comboId')
    .delete(
        Authorize.authorizeTeacher,
        CheckingCombo.checkMofifyCombo,
        ComboController.deleteCombo
    )

router.route('/teacher/:teacherId/page/:page')
    .get(
        Authorize.checkGetAll,
        Authorize.verifyUser,
        CheckingExam.checkGetExamCreatedByTeacher,
        ComboController.getComboCreatedByTeacher
    )


module.exports = router;

export {}