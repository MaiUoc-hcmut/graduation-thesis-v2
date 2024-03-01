const Progress = require('../../db/models/course_progress');

import { Request, Response, NextFunction } from 'express';

class ProgressController {

    // [GET] /progresses/:studentId/:courseId
    getProgressOfCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { studentId, courseId } = req.params;

            const progress = await Progress.findAll({
                where: {
                    id_student: studentId,
                    id_course: courseId
                }
            });

            res.status(200).json(progress);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /progresses/increase
    increaseProgress = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        const { id_student, id_topic, id_course } = body;
        try {
            const newProgress = await Progress.create({
                id_student,
                id_topic,
                id_course
            });

            res.status(201).json(newProgress);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new ProgressController();