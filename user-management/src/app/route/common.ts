const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');

router.route('/search')
    .get(CommonController.searchUser);


module.exports = router;


export {}