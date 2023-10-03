const expressApp = require('express');
const router = expressApp.Router();
const Auth = require('../controllers/authController');
const passportTeacher = require('passport');
const authTeacher = require('../middleware/teacherAuth');

router.post('/register', Auth.registerTeacher);
router.post(
    '/login', 
    passportTeacher.authenticate('local', { session: false, failureMessage: true }),
    Auth.loginTeacher
);
router.post('/refresh-token', Auth.refreshToken);

module.exports = router