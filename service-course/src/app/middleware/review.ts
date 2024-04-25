const StudentCourse = require('../../db/models/student-course');
const Review = require('../../db/models/review');

import axios from "axios";
import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

require('dotenv').config();


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

                try {
                    const teacher = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${body.id_teacher}`);
                } catch (error) {
                    let e = "Teacher does not exist!";
                    return next(createError.BadRequest(e));
                }
            }
            
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
    
    checkDeleteReview = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;
            const id_review = req.params.reviewId;

            const review = await Review.findByPk(id_review);

            if (id_user !== review.id_student && role !== "admin") {
                let error = "You do not have permission to delete this review!"
                return next(createError.Unauthorized(error));
            }
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingReview();