const express = require('express');
const router = express.Router();

const GroupController = require('../app/controllers/GroupController');
const Authorize = require('../app/middleware/authorize');

router.route('/')
    .post(Authorize.verifyUser, GroupController.createGroup)

module.exports = router;