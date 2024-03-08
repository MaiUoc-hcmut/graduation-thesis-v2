const express = require('express');
const router = express.Router();
const AnswerController = require('../app/controllers/AnswerController');
const Authorize = require('../app/middleware/authorize');
const CheckingAnswer = require('../app/middleware/answer');

router.route('/')
    .post(Authorize.verifyUser, CheckingAnswer.checkCreateAnswer, AnswerController.createAnswer);

router.route('/:answerId')
    .delete(Authorize.verifyUser, CheckingAnswer.checkDeleteAnswer, AnswerController.deleteAnswer);

module.exports = router;