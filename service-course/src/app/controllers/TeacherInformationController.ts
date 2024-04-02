const Course = require('../../db/models/course');
const Review = require('../../db/models/review');
const StudentCourse = require('../../db/models/student-course');

import { Request, Response, NextFunction } from 'express';

class TeacherInformationController {

    // [GET] /teacher/:teacherId
    getCourseServiceInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const courses = await Course.findAll({
                where: { id_teacher }
            });

            let total_submit = 0;
            for (const course of courses) {
                let submits = await StudentCourse.count({
                    where: {
                        id_course: course.id
                    }
                });
                total_submit += submits.length;
            }

            const reviews = await Review.findAll({
                where: { id_teacher }
            });

            const total_reviews = reviews.length;
            let total_rating = 0;
            for (const review of reviews) {
                total_rating += review.rating;
            }

            const average_rating = total_rating / total_reviews;

            res.status(200).json({
                total_reviews,
                average_rating,
                course_quantity: courses.length,
                total_submit
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }
}

module.exports = new TeacherInformationController();