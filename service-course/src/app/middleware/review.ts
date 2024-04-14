const StudentCourse = require('../../db/models/student-course');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');


class CheckingReview {
    checkCreateReview = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const { object, ...body } = req.body.data;
            const id_student = req.student.data.id;

            const fields = ['id_course', 'id_exam', 'id_teacher'];

            const presentFields = fields.filter(field => body.hasOwnProperty(field));
            if (presentFields.length === 0 || presentFields.length > 1) {
                let error = "You must choose object to review!";
                return next(createError.BadRequest(error));
            }

            if (object === "course") {
                const record = await StudentCourse.findOne({
                    where: {
                        id_student,
                        id_course: body.id_course
                    }
                });
    
                if (!record) {
                    let error = "You must buy this course to create review!"
                    return next(createError.Unauthorized(error));
                }

                if (!body.id_course) {
                    let error = "You must provide id_course to review a course!";
                    return next(createError.BadRequest(error));
                }
            }

            if (object === "teacher") {
                if (!body.id_teacher) {
                    let error = "You must provide id_teacher to review a course!";
                    return next(createError.BadRequest(error));
                }
            }

            if (object === "exam") {
                if (!body.id_exam) {
                    let error = "You must provide id_exam to review a course!";
                    return next(createError.BadRequest(error));
                }
            }
            
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingReview();