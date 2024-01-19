const express = require('express');
const router = express.Router();
const commentController = require("../app/controllers/CommentController");

const fileUpload = require('../config/firebase/fileUpload');

router.put("/:id", commentController.update);
router.delete("/:id", commentController.delete);
router.post("/", fileUpload.uploadImageComment, commentController.create);
router.get("/:id", commentController.getComment);
router.get("/", commentController.getAllComment);

module.exports = router;
