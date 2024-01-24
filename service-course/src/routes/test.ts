const express = require('express');
const router = express.Router();

const testControler = require('../app/controllers/test');

const fileUpload = require('../config/firebase/fileUpload');

router.post('/', fileUpload.uploadVideo, testControler.testUploadFile);

module.exports = router;