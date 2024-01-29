const passport = require('passport');
const dotenv = require('dotenv').config();
const createError = require('http-errors');

const Course = require('../../db/models/course');

import { Request, Response, NextFunction } from "express";



declare global {
    namespace Express {
        interface Request {
            teacher?: any;
        }
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
            if (req.params.courseId !== undefined) {
                const course = await Course.findByPk(req.params.courseId);
                if (!course) return next(createError.NotFound("Course does not exist"));
                if (teacher.data.id !== course.id_teacher) {
                    return next(createError.Unauthorized("You do not have permission to get the courses"));
                }
            }
            req.teacher = teacher;
            next();
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