const Exam = require('../../db/model/exam');
const Question = require('../../db/model/question');
const Answer = require('../../db/model/answer');
const Category = require('../../db/model/category');
const ExamDraft = require('../../db/model/exam_draft');
const { Op } = require("sequelize");

const { sequelize } = require('../../config/db/index');

import { Request, Response, NextFunction } from "express";

require('dotenv').config();

declare global {
    namespace Express {
        interface Request {
            teacher?: any;
            student?: any;
        }
    }
}

class ExamController {

    // Get all exam
    // [GET] /api/v1/exam
    getAllExams = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const exams = await Exam.findAll();
            res.status(200).json(exams);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Get single exam by its id
    // [GET] /api/v1/exams/:examId
    getExamById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const examId = req.params.examId;
            const exam = await Exam.findByPk(examId);

            if (!exam) return res.status(404).json({ message: "Exam not found!" });

            res.status(200).json(exam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Get all exam that created by teacher
    // [GET] /api/v1/exams/teacher/:teacherId/page/:page
    getExamCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const teacherId = req.params.teacherId;

            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            const count = await Exam.count({
                where: { id_teacher: teacherId }
            });

            const exams = await Exam.findAll({
                where: { id_teacher: teacherId },
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            res.status(200).json({ count, exams });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET]/api/v1/exams/full/:examId
    getDetailExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_exam = req.params.examId;

            const exam = await Exam.findByPk(id_exam, {
                include: [
                    {
                        model: Question,
                        as: 'questions',
                        include: [
                            {
                                model: Answer,
                                as: 'answers'
                            }
                        ]
                    }
                ]
            });

            res.status(200).json(exam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Create an exam
    // [POST] /api/v1/exams
    createExam = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        
        const t = await sequelize.transaction();
        try {
            const { title, period, status, questions, id_course, categories } = body;
            const quantity_question = questions.length;
            const id_teacher = req.teacher.data.id;

            if (!title || !period) {
                return res.status(400).json({ message: "Information missed!" });
            }
                
            
            if (categories === undefined || categories.length === 0) {
                return res.status(400).json({ message: "Category missed!" })
            }

            let categoryInstances: any[] = [];
            for (const id of categories) {
                const category = await Category.findByPk(id);
                categoryInstances.push(category);
            }

            const actualStatus = status !== undefined ? status : true;

            const newExam = await Exam.create({
                id_teacher,
                id_course,
                title,
                period,
                quantity_question,
                status: actualStatus
            }, {
                transaction: t
            });

            await newExam.addCategories(categoryInstances, { transaction: t });


            for (const question of questions) {
                const { question_categories, knowledges, answers, ...questionBody } = question;

                const questionDraft = await ExamDraft.findOne({
                    where: { id_question: questionBody.id }
                });

                let content_image = "";

                // If draft exist, means image of question has been uploaded
                if (questionDraft) {
                    content_image = questionDraft.url;
                }

                const newQuestion = await Question.create({
                    id_exam: newExam.id,
                    id_teacher,
                    ...questionBody,
                    content_image
                }, {
                    transaction: t
                });
                

                if (question_categories !== undefined && question_categories.length !== 0) {
                    let questionCategoryInstances: any[] = [];
                    for (const id of question_categories) {
                        const category = await Category.findByPk(id);
                        questionCategoryInstances.push(category);
                    }

                    newQuestion.addCategories(questionCategoryInstances, { transaction: t });
                }

                if (answers === undefined || answers.length === 0) {
                    return res.status(400).json({
                        message: "Question must have its own answers!"
                    });
                }

                for (const answer of answers) {
                    await Answer.create({
                        id_question: newQuestion.id,
                        ...answer
                    }, {
                        transaction: t
                    });
                }
            }

            await t.commit();

            res.status(201).json(newExam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });

            await t.rollback();
        }
    }

    studentSubmitExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.student.data.id
            const data = req.body.data

            res.status(201).json();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Delete an exam
    // [DELETE] /api/v1/exams/:examId
    deleteExam = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const examId = req.params.examId;

            await Exam.destroy({
                where: { id: examId }
            }, {
                transaction: t
            });

            res.status(200).json({
                examId,
                message: "Exam has been deleted",
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = new ExamController();
