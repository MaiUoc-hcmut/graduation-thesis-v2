const Course = require('../../db/models/course');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingCourse {
    checkModifyCourse = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_course = req.params.courseId;
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const course = await Course.findByPk(id_course);
            if (!course) {
                let error = "Course does not exist!"
                return next(createError.BadRequest(error));
            }

            if (role !== "admin" && id_user !== course.id_teacher) {
                console.log(id_user, course.id_teacher);
                let error = "You does not have permission to do this action!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkSearchCourseOfTeacher = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const id_user = req.user?.user?.data.id;
            const role = req.user?.role;

            if (role !== "admin" && id_user !== id_teacher) {
                let error = "You do not have permission to get the course";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkExistedCourse = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_course = req.params.courseId;

            const course = await Course.findByPk(id_course);

            if (!course) {
                let error = "Course does not exist!";
                return next(createError.BadRequest(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkGetCourseStudentPaid = async (req: Request, _res: Response, next: NextFunction) => {
        
    }
}

module.exports = new CheckingCourse();