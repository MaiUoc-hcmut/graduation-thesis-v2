const Exam = require('../../db/model/exam');

import { Request, Response, NextFunction } from 'express';

const { Op } = require('sequelize');

class TeacherInformationController {

    // [GET] /teacher/:teacherId
    getExamServiceInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const exam_quantity = await Exam.count({
                where: {
                    id_teacher,
                    id_course: {
                        [Op.or]: [null, ""]
                    }
                }
            });

            res.status(200).json(exam_quantity);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }
}

module.exports = new TeacherInformationController();