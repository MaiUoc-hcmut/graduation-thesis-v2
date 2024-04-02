const StudentCourse = require('../../db/models/student-course');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');


class CheckingReview {
    checkCreateReview = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const { object, ...body } = req.body.data;
            const id_student = req.student.data.id;

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
            
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingReview();