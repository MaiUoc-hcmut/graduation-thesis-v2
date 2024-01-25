const express = require('express');
const router = express.Router();
const commentController = require("../app/controllers/CommentController");

const fileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .get(commentController.getAllComment)
    .post(fileUpload.uploadImageComment, commentController.uploadCommentImage, commentController.createComment);

router.route('/:commentId')
    .get(commentController.getCommentById)
    .delete(commentController.deleteComment)

router.route('/lecture/:lectureId')
    .get(commentController.getCommentBelongToLecture);

router.put("/:id", commentController.update);

module.exports = router;
