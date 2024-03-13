const Assignment = require('../../db/model/assignment');
const DetailQuestion = require('../../db/model/detail_question');
const Exam = require('../../db/model/exam');
const Answer = require('../../db/model/answer');
const SelectedAnswer = require('../../db/model/selected_answer');

const { sequelize } = require('../../config/db/index');
const axios = require('axios');

import { Request, Response, NextFunction } from "express";

require('dotenv').config();

class AssignmentController {

    // [GET] /assignments/page/:page
    getAllAssignments = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            const count = await Assignment.count();
            const assignments = await Assignment.findAll({
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'ASC']]
            });

            res.status(200).json({ count, assignments });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });

        }
    }

    // [GET] /assignments/student/:studentId/page/:page
    getAssignmentsOfStudent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;

            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            const count = await Assignment.count({
                where: { id_student }
            });

            const assignments = await Assignment.findAll({
                where: { id_student },
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'ASC']]
            });

            res.status(200).json({ count, assignments });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /assignments/exam/:examId/page/:page
    getAssignmentsOfExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_exam = req.params.examId;

            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            const count = await Assignment.count({
                where: { id_exam }
            });

            const assignments = await Assignment.findAll({
                where: { id_exam },
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'ASC']]
            });

            res.status(200).json({ count, assignments });
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /assignments/full/:assignmentId
    getDetailOfAssignment = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_assignment = req.params.assignmentId;

            const assignment = await Assignment.findByPk(id_assignment, {
                include: [
                    {
                        model: DetailQuestion,
                        as: 'details',
                        attributes: ['id_question'],
                        include: [
                            {
                                model: Answer,
                                through: {
                                    attributes: ['is_selected']
                                },
                            }
                        ]
                    }
                ]
            });

            res.status(200).json(assignment);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /assignments
    submitAssignment = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;

        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const t = await sequelize.transaction();
        try {
            const id_student = req.student?.data.id;

            const { id_exam, time_start, time_end, assignment } = body;

            if (
                id_exam === undefined ||
                time_start === undefined ||
                time_end === undefined ||
                assignment === undefined ||
                assignment.length === 0
            ) {
                return res.status(400).json({
                    message: "Information missed!"
                });
            }

            const exam = await Exam.findByPk(id_exam);
            if (!exam) {
                return res.status(400).json({
                    message: "Exam does not exist, check your id_exam!"
                });
            }

            let score = 0;
            let right_question = 0;
            let wrong_question = 0;
            let empty_question = 0;
            let passed = false;

            const newAssignment = await Assignment.create({
                id_exam,
                id_student,
                score,
                passed,
                right_question,
                wrong_question,
                empty_question,
                time_start,
                time_end
            }, {
                transaction: t
            });

            for (const question of assignment) {
                const { id_question, answers } = question;

                if (answers === undefined || answers.length === 0) {
                    return res.status(400).json({
                        message: `Answers missed!`,
                        question: id_question
                    });
                }

                const newDetailQuestion = await DetailQuestion.create({
                    id_question,
                    id_assignment: newAssignment.id
                }, {
                    transaction: t
                });

                let right_flag = true;
                let empty_flag = true;

                for (const answer of answers) {
                    const { id_answer, is_selected } = answer;

                    const answerToAdd = await Answer.findByPk(id_answer);

                    if (!answerToAdd) {
                        return res.status(400).json({
                            message: "Answer does not exist!",
                            answer: id_answer
                        });
                    }

                    // await answerToAdd.addDetailQuestion(newDetailQuestion, { through: { is_selected: true }, transaction: t });
                    await SelectedAnswer.create({
                        id_answer,
                        id_detail_question: newDetailQuestion.id,
                        is_selected
                    }, {
                        transaction: t
                    });
                    right_flag = is_selected === answerToAdd.is_correct ? right_flag : false;
                    empty_flag = is_selected ? false : empty_flag;
                }
                right_question = right_flag ? ++right_question : right_question;
                empty_question = empty_flag ? ++empty_question : empty_question;
                wrong_question = assignment.length - right_question - empty_question;
            }

            score = (right_question / assignment.length) * 10;
            passed = score >= exam.pass_score ? true : false;

            await newAssignment.update({ score, passed, right_question, wrong_question, empty_question }, { transaction: t });

            await t.commit();

            res.status(201).json(newAssignment);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });

            await t.rollback();
        }
    }
}

module.exports = new AssignmentController();