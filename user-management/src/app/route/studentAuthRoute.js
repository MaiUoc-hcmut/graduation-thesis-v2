const express = require('express');
const router = express.Router();
const Auth = require('../controllers/authController');
const passport = require('passport');
const auth = require('../middleware/studentAuth');

router.post('/register', Auth.registerStudent);
router.post(
    '/login', 
    passport.authenticate('local', { session: false, failureMessage: true }),
    Auth.loginStudent
);
router.post('/refresh-token', Auth.refreshToken);
 
module.exports = router;