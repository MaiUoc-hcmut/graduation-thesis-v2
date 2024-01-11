const Exam = require('../../db/model/exam');
const Question = require('../../db/model/question');
const Answer = require('../../db/model/answer');

import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            teacher?: any;
        }
    }
}

class ExamController {

    // Get all exam
    // [GET] /api/v1/exam
    getAllExams = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const exams = Exam.findAll();
            res.status(200).json(exams);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Get single exam by its id
    // [GET] /api/v1/exam/:examId
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
    // [GET] /api/v1/exam/teacher/:teacherId
    getExamCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const teacherId = req.params.teacherId;

            const exams = await Exam.findAll({
                where: { id_teacher: teacherId }
            })

            res.status(200).json(exams);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Create an exam
    // [POST] /api/v1/exam
    createExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { title, period, status, questions, id_course } = req.body;
            const quantity_question = questions.length;
            const id_teacher = req.teacher.data.id;

            if (!title || !period)
                res.status(400).json({ message: "Information missed" });

            const actualStatus = status !== undefined ? status : true;

            const newExam = await Exam.create({
                id_teacher,
                id_course,
                title,
                period,
                quantity_question,
                status: actualStatus
            });

            // const newExamId = newExam.id;
            const newQuestions = [];

            for (const question of questions) {
                const { content_text, content_image, categories, answers } = question;
                const newQuestion = await Question.create({
                    id_teacher,
                    content_text,
                    content_image
                });
                newQuestions.push(newQuestion);

                for (const answer of answers) {
                    await Answer.create({
                        content_text: answer.content_text,
                        content_image: answer.content_image,
                        is_correct: answer.is_correct
                    })
                }
            }

            newExam.addQuestions(newQuestions);

            res.status(201).json(newExam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Delete an exam
    // [DELETE] /api/v1/exam/:examId
    deleteExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const examId = req.params.examId;

            const exam = Exam.findByPk(examId);

            if (!exam) 
                return res.status(404).json({ message: "Document does not exist!"});

            const teacherId = req.teacher.data.id;

            if (exam.id_teacher !== teacherId) 
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            await exam.destroy();

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

