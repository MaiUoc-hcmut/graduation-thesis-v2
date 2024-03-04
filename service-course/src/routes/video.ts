const express = require('express');
const router = express.Router();
const VideoController = require("../app/controllers/VideoController");
const FileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .post(FileUpload.uploadVideo, VideoController.uploadSingleLectureVideo);

router.route('/update')
    .put(FileUpload.uploadVideo, VideoController.uploadSingleLectureVideoForUpdate);

module.exports = router;