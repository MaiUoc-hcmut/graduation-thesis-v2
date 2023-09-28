const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Teacher = require('../models/teacher');
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
            const teacher = await Teacher.findOne({
                where: { id: payload.id }
            });
            if (!teacher) {
                done(new Exception('User not found!', 401), false);
            }
            // success case
            return done(null, teacher);
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

            const teacher = await Teacher.findOne({
                where: { email: email },
                attribute: ['name', 'email']
            })
            if (!teacher) done(createError.Unauthorized("Invalid email!"));

            const isValidPassword = await bcrypt.compare(password, teacher.password);
            if (!isValidPassword) done(createError.Unauthorized("Wrong password!"));
            // console.log(teacher);
            done(null, teacher);
        } catch (err) {
            done(err, false);
        }
    })
);

// middleware verify access token
exports.protectedAPI = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, teacher, info) => {
        if (err || !teacher) {
            return next(createError.Unauthorized(info?.message ? info.message : "User is not authorized"));
        } else {
            req.teacher = teacher;
            next();
        }
    })(req, res, next);
};
