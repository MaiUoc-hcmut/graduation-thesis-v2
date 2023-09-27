const express = require('express');
const router = express.Router();
const Auth = require('../controllers/studentAuthController');
const passport = require('passport');
const auth = require('../middleware/studentAuth');

router.post('/register', Auth.register);
router.post(
    '/login', 
    passport.authenticate('local', { session: false, failureMessage: true }),
    Auth.login
);
router.post('/refresh-token', Auth.refreshToken);
 
module.exports = router;