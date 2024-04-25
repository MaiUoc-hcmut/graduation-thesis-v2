const Course = require('../../db/models/course');
const Review = require('../../db/models/review');
const StudentCourse = require('../../db/models/student-course');

import { Request, Response, NextFunction } from 'express';

class UserInformationController {

    // [GET] /teacher/:teacherId
    getTeacherInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const courses = await Course.findAll({
                where: { id_teacher }
            });
            
            res.status(200).json({
                course_quantity: courses.length
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }

    // [GET] /student/:studentId
    getStudentInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }
}

module.exports = new UserInformationController();