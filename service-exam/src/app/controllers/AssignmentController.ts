const Assignment = require('../../db/model/assignment');
const DetailQuestion = require('../../db/model/detail_question');
const Exam = require('../../db/model/exam');
const Question = require('../../db/model/question');
const Answer = require('../../db/model/answer');
const SelectedAnswer = require('../../db/model/selected_answer');

const { sequelize } = require('../../config/db/index');
const axios = require('axios');

import { Request, Response, NextFunction } from "express";

const { Op } = require('sequelize');

require('dotenv').config();

class AssignmentController {

    // [GET] /assignments/page/:page
    getAllAssignments = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            let preDate: Date = new Date(0);;
            let postDate: Date = new Date();

            if (typeof req.query.postDate === 'string' || typeof req.query.postDate === 'number') {
                postDate = new Date(req.query.postDate);
            } else if (req.query.postDate instanceof Date) {
                postDate = req.query.postDate;
            }

            if (typeof req.query.preDate === 'string' || typeof req.query.preDate === 'number') {
                preDate = new Date(req.query.preDate);
            } else if (req.query.preDate instanceof Date) {
                preDate = req.query.preDate;
            }

            const date_condition: any = {
                [Op.between]: [preDate, postDate]
            }

            const status = req.query.status;
            const id_course = req.query.id_course;

            let status_condition = [];

            if (status === "pass") {
                status_condition = [true];
            } else if (status === "fail") {
                status_condition = [false];
            } else {
                status_condition = [true, false];
            }

            const queryOption: any = {
                where: {
                    passed: status_condition,
                    createdAt: date_condition
                }
            }

            if (id_course && typeof id_course === "string") {
                queryOption.include = [{
                    model: Exam,
                    where: {
                        id_course
                    }
                }];
            }

            const count = await Assignment.count({
                ...queryOption,
                distinct: true
            });
            const assignments = await Assignment.findAll({
                ...queryOption,
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'DESC']]
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

            let preDate: Date = new Date(0);;
            let postDate: Date = new Date();

            if (typeof req.query.postDate === 'string' || typeof req.query.postDate === 'number') {
                postDate = new Date(req.query.postDate);
            } else if (req.query.postDate instanceof Date) {
                postDate = req.query.postDate;
            }

            if (typeof req.query.preDate === 'string' || typeof req.query.preDate === 'number') {
                preDate = new Date(req.query.preDate);
            } else if (req.query.preDate instanceof Date) {
                preDate = req.query.preDate;
            }

            const date_condition: any = {
                [Op.between]: [preDate, postDate]
            }

            const status = req.query.status;
            const id_course = req.query.id_course;

            let status_condition = [];

            if (status === "pass") {
                status_condition = [true];
            } else if (status === "fail") {
                status_condition = [false];
            } else {
                status_condition = [true, false];
            }

            const queryOption: any = {
                where: {
                    passed: status_condition,
                    createdAt: date_condition,
                    id_student
                }
            }

            if (id_course && typeof id_course === "string") {
                queryOption.include[0].where.id_course = id_course;
            }

            const count = await Assignment.count(queryOption);
            const assignments = await Assignment.findAll({
                ...queryOption,
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({ count, assignments });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /assignments/teacher/:teacherId/page/:page
    getAssignmentsOfExamsOfTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            let preDate: Date = new Date(0);;
            let postDate: Date = new Date();

            if (typeof req.query.postDate === 'string' || typeof req.query.postDate === 'number') {
                postDate = new Date(req.query.postDate);
            } else if (req.query.postDate instanceof Date) {
                postDate = req.query.postDate;
            }

            if (typeof req.query.preDate === 'string' || typeof req.query.preDate === 'number') {
                preDate = new Date(req.query.preDate);
            } else if (req.query.preDate instanceof Date) {
                preDate = req.query.preDate;
            }

            const date_condition: any = {
                [Op.between]: [preDate, postDate]
            }

            const status = req.query.status;
            const id_course = req.query.id_course;

            let status_condition = [];

            if (status === "pass") {
                status_condition = [true];
            } else if (status === "fail") {
                status_condition = [false];
            } else {
                status_condition = [true, false];
            }

            const queryOption: any = {
                where: {
                    passed: status_condition,
                    createdAt: date_condition
                },
                include: [
                    {
                        model: Exam,
                        where: {
                            id_teacher
                        }
                    }
                ]
            }

            if (id_course && typeof id_course === "string") {
                queryOption.include[0].where.id_course = id_course;
            }

            const count = await Assignment.count({
                ...queryOption,
                distince: true
            });
            const assignments = await Assignment.findAll({
                ...queryOption,
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'DESC']]
            });

            for (const assignment of assignments) {
                const user = await axios.get(`${process.env.BASE_URL_USER_LOCAL}/student/${assignment.id_student}`);

                assignment.dataValues.student = {
                    id: user.data.id,
                    avatar: user.data.avatar,
                    name: user.data.name
                }

                delete assignment.dataValues.id_student
            }

            res.status(200).json({ count, assignments });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /assignments/student/:studentId/exam/:examId/page/:page
    getAssignmentsOfStudentOfExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;
            const id_exam = req.params.examId;

            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const currentPage: number = +req.params.page;

            let preDate: Date = new Date(0);;
            let postDate: Date = new Date();

            if (typeof req.query.postDate === 'string' || typeof req.query.postDate === 'number') {
                postDate = new Date(req.query.postDate);
            } else if (req.query.postDate instanceof Date) {
                postDate = req.query.postDate;
            }

            if (typeof req.query.preDate === 'string' || typeof req.query.preDate === 'number') {
                preDate = new Date(req.query.preDate);
            } else if (req.query.preDate instanceof Date) {
                preDate = req.query.preDate;
            }

            const date_condition: any = {
                [Op.between]: [preDate, postDate]
            }

            const status = req.query.status;

            let status_condition = [];

            if (status === "pass") {
                status_condition = [true];
            } else if (status === "fail") {
                status_condition = [false];
            } else {
                status_condition = [true, false];
            }

            const queryOption: any = {
                where: {
                    passed: status_condition,
                    createdAt: date_condition,
                    id_student,
                    id_exam
                }
            }

            const count = await Assignment.count(queryOption);
            const assignments = await Assignment.findAll({
                ...queryOption,
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'DESC']]
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

            let preDate: Date = new Date(0);;
            let postDate: Date = new Date();

            if (typeof req.query.postDate === 'string' || typeof req.query.postDate === 'number') {
                postDate = new Date(req.query.postDate);
            } else if (req.query.postDate instanceof Date) {
                postDate = req.query.postDate;
            }

            if (typeof req.query.preDate === 'string' || typeof req.query.preDate === 'number') {
                preDate = new Date(req.query.preDate);
            } else if (req.query.preDate instanceof Date) {
                preDate = req.query.preDate;
            }

            const date_condition: any = {
                [Op.between]: [preDate, postDate]
            }

            const status = req.query.status;
            const id_course = req.query.id_course;

            let status_condition = [];

            if (status === "pass") {
                status_condition = [true];
            } else if (status === "fail") {
                status_condition = [false];
            } else {
                status_condition = [true, false];
            }

            const queryOption: any = {
                where: {
                    passed: status_condition,
                    createdAt: date_condition,
                    id_exam
                }
            }

            const count = await Assignment.count(queryOption);
            const assignments = await Assignment.findAll({
                ...queryOption,
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                order: [['createdAt', 'DESC']]
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
                                attributes: ['id', 'is_correct', 'content_text', 'content_image'],
                                through: {
                                    attributes: ['is_selected']
                                },
                            }
                        ]
                    }
                ]
            });

            for (let question of assignment.details) {
                const q = await Question.findByPk(question.id_question);

                if (!q) {
                    return res.status(500).json({
                        message: "For some reason, question has been deleted or did not exist!"
                    });
                }
                let is_correct = true;
                for (let answer of question.Answers) {
                    if (answer.is_correct && answer.selected_answer.is_selected) is_correct = false;
                }

                question.dataValues.content_text = q.content_text;
                question.dataValues.content_image = q.content_image;
                question.dataValues.multi_choice = q.multi_choice;
                question.dataValues.is_correct = is_correct;
            }

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

            const { id_exam, time_start, time_end, assignment, id_topic } = body;

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

            if (passed && exam.id_course) {
                await axios.post(`${process.env.BASE_URL_COURSE_LOCAL}/progresses/increase`, {
                    data: {
                        id_student,
                        id_course: exam.id_course,
                        id_topic
                    }
                });
            }

            await t.commit();

            res.status(201).json(newAssignment);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });

            await t.rollback();
        }
    }
}

module.exports = new AssignmentController();