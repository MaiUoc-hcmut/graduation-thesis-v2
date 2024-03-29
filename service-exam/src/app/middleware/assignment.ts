const Assignment = require('../../db/model/assignment');
const Exam = require('../../db/model/exam');

const createError = require('http-errors');

import { Request, Response, NextFunction } from "express";

require('dotenv').config();

class CheckingAssignment {
    checkSubmitAssignment = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkGetAssignmentsOfStudent = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_student = req.params.studentId;
            const id_assignment = req.params.assignmentId;

            const id_user = req.user?.user?.data.id;
            const role = req.user?.role;

            // For API get list assignment of student
            if (id_student) {
                if (role !== "admin" && id_user !== id_student) {
                    let error = "You do not have permission to get this data!";
                    return next(createError.Unauthorized(error));
                }
            }

            // For API get detaill of single assignment
            if (id_assignment) {
                const assignment = await Assignment.findByPk(id_assignment);
                const exam = await Exam.findByPk(assignment.id_exam);
                if (!assignment) {
                    let error = "Assignment does not exist!";
                    return next(createError.BadRequest(error));
                }
                if (role !== "admin" && id_user !== assignment.id_student && id_user !== exam.id_teacher) {
                    let error = "You do not have permission to get this data!";
                    return next(createError.Unauthorized(error));
                }
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkGetAssignmentsOfExam = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_exam = req.params.examId;
            const id_user = req.user?.user?.data.id;
            const role = req.user?.role;

            const exam = await Exam.findByPk(id_exam);
            if (!exam) {
                let error = "Exam does not exit";
                return next(createError.BadRequest(error));
            }

            if (role !== "admin" && id_user !== exam.id_teacher) {
                let error = "You do not have permission to get this data!";
                return next(createError.Unauthorized(error));
            }

            next();

        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingAssignment();