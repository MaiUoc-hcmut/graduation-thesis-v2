const express = require('express');
const router = express.Router();
const TopicForumController = require('../app/controllers/TopicForumController');
const Authorize = require('../app/middleware/authorize');

router.route('/')
    .post(Authorize.verifyUser, TopicForumController.createTopic);

router.route('/:topicId/page/:page')
    .get(TopicForumController.getDetailTopicById);

router.route('/:topicId')
    .delete(TopicForumController.deleteTopic);

module.exports = router;

