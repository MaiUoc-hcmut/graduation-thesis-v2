const passport = require('passport');
require('./passport');
require('dotenv').config();
const createError = require('http-errors');

import { Request, Response, NextFunction } from "express";

const axios = require('axios');


declare global {
    namespace Express {
        interface Request {
            teacher?: any;
            student?: any;
            user?: USER;
        }
    }

    type USER = {
        user?: any,
        role?: string,
    }
}

class Authorize {
    authorizeTeacher = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', { session: false }, async (err: any, teacher: any, info: any) => {
            if (err || !teacher) {
                return next(createError.Unauthorized(info?.message ? info.message : err));
            }
            if (req.params.teacherId !== undefined && req.params.teacherId !== teacher.data.id) {
                return next(createError.Unauthorized("You do not have permission to get the courses"))
            }
            req.teacher = teacher;
            next();
        })(req, res, next);
    }

    verifyUser = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('user-jwt', { session: false }, async (err: any, id: string, info: any) => {
            if (err) {
                return next(createError.Unauthorized(info?.message ? info.message : err))
            }
            
            let user: {
                user?: any,
                role?: string
            } = {};
            
            try {
                const student = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${id}`);
                user.user = student;
                user.role = "student";
                req.user = user;
                next();
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    // If student does not exist, try to find teacher
                    try {
                        const teacher = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${id}`);
                        user.user = teacher;
                        user.role = "teacher";
                        req.user = user;
                        next();
                    } catch (error) {
                        // If both student and teacher do not exist
                        return next(createError.NotFound("User not found!"));
                    }
                } else {
                    // Other error
                    return next(createError.InternalServerError(error.message));
                }
            }
            
        })(req, res, next);
    }

    verifyStudent = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('user-jwt', { session: false }, async (err: any, id: string, info: any) => {
            if (err) {
                return next(createError.Unauthorized(info?.message ? info.message : err))
            }
            try {
                const student = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${id}`);
                req.student = student;
                next();
            } catch (error: any) {
                console.log(error.message);
                next(error);
            }
        })(req, res, next);
    }

    protectedAPI = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', { session: false }, (err: any, teacher: any, info: any) => {
            if (err || !teacher) {
                return next(createError.Unauthorized(info?.message ? info.message : err));
            } else {
                req.teacher = teacher;
                next();
            }
        })(req, res, next);
    };
}

module.exports = new Authorize();