const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Student = require('../models/student');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

// to authorize user using jwt
const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
passport.use(
    new JWTStrategy(jwtConfig, async (payload, done) => {
        try {
            console.log(payload);
            const student = await Student.findOne({
                where: { id: payload.id }
            });
            if (!student) {
                done(new Exception('User not found!', 401), false);
            }
            // success case
            return done(null, student);
        } catch (err) {
            done(err, false);
        }
    })
);


// to authenticate user with username and password
const localConfig = {
    usernameField: 'email',
    passwordField: 'password',
};
passport.use(
    new LocalStrategy(localConfig, async (email, password, done) => {
        try {
            if (!email || !password) {
                done(createError.BadRequest('Email and password are required'));
            }

            const student = await Student.findOne({
                where: { email: email },
                attribute: ['name', 'email']
            })
            if (!student) done(createError.Unauthorized("Invalid email!"));

            const isValidPassword = await bcrypt.compare(password, student.password);
            if (!isValidPassword) done(createError.Unauthorized("Wrong password!"));
            // console.log(student);
            done(null, student);
        } catch (err) {
            done(err, false);
        }
    })
);

// middleware verify access token
exports.protectedAPI = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, student, info) => {
        if (err || !student) {
            return next(createError.Unauthorized(info?.message ? info.message : "User is not authorized"));
        } else {
            req.student = student;
            next();
        }
    })(req, res, next);
};
