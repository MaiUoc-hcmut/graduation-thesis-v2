const Exam = require('../../db/model/exam');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingExam {
    checkModifyExam = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_teacher = req.teacher?.data.id;
            const id_exam = req.params.examId;

            const exam = await Exam.findByPk(id_exam);
            if (!exam) {
                let error = "Exam does not exist!";
                return next(createError.BadRequest(error));
            }
            if (exam.id_teacher !== id_teacher) {
                let error = "You do not have permission to do this action!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}


module.exports = new CheckingExam();