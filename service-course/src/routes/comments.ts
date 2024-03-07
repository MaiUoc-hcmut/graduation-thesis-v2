const express = require('express');
const router = express.Router();
const commentController = require("../app/controllers/CommentController");
const Authorize = require('../app/middleware/authorize');
const CheckingComment = require('../app/middleware/comment');

// const fileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .get(commentController.getAllComment)
    .post(Authorize.verifyUser, CheckingComment.checkParentCreateComment, commentController.createComment);

router.route('/:commentId')
    .get(commentController.getCommentById)
    .delete(commentController.deleteComment)

router.route('/topic/:topicId/page/:page')
    .get(commentController.getCommentBelongToTopic);

router.put("/:id", commentController.update);

module.exports = router;
