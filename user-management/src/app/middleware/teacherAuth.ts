const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const dotenv = require('dotenv').config();
const axios = require('axios');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const Teacher = require('../models/teacher');

import { Request, Response, NextFunction } from "express";

// to authorize user using jwt
const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
passport.use(
    new JWTStrategy(jwtConfig, async (payload: any, done: any) => {
        try {
            const teacherId = payload.id;
            const teacher = await axios.get(`${process.env.BASE_URL_LOCAL}/student/get-student-by-id/${teacherId}`);
            if (!teacher) {
                done(new Error('User not found!'), false);
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
    new LocalStrategy(localConfig, async (email: string, password: string, done: any) => {
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
            // console.log(student);
            done(null, teacher);
        } catch (err) {
            done(err, false);
        }
    })
);

declare global {
    namespace Express {
        interface Request {
            teacher?: any;
        }
    }
}

// middleware verify access token
exports.protectedAPI = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, teacher: any, info: any) => {
        if (err || !teacher) {
            return next(createError.Unauthorized(info?.message ? info.message : "User is not authorized"));
        } else {
            req.teacher = teacher;
            next();
        }
    })(req, res, next);
};