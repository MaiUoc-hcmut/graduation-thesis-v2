const express = require('express');
const router = express.Router();
const imageController = require("../app/controllers/ImageController");

router.route('/')
    .post(imageController.uploadSingleImage);

module.exports = router;