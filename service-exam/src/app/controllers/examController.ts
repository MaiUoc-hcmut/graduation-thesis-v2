const Exam = require('../../db/model/exam');
const Question = require('../../db/model/question');
const Answer = require('../../db/model/answer');
const Category = require('../../db/model/category');
const ParentCategory = require('../../db/model/par_category');
const ExamDraft = require('../../db/model/exam_draft');
const { Op } = require("sequelize");

const algoliasearch = require('algoliasearch');

const { sequelize } = require('../../config/db/index');
const axios = require('axios');

import { log } from "console";
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
            const exams = await Exam.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['name', 'id'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            for (const exam of exams) {
                const user = await axios.get(`${process.env.BASE_URL_USER_LOCAL}/teacher/get-teacher-by-id/${exam.id_teacher}`);
                exam.dataValues.user = { id: user.data.id, name: user.data.name };
            }

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
                include: [
                    {
                        model: Category,
                        attributes: ['name', 'id_par_category'],
                        through: {
                            attributes: []
                        }
                    },
                ],
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            for (const exam of exams) {
                // Format category before response
                for (const category of exam.Categories) {
                    const parCategory = await ParentCategory.findByPk(category.id_par_category);
                    category.dataValues[`${parCategory.name}`] = category.name;

                    delete category.dataValues.name;
                    delete category.dataValues.id_par_category;
                }
            }

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
                    },
                    {
                        model: Category,
                        attributes: ['id', 'name', 'id_par_category'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            if (!exam) return res.status(404).json({ message: "Exam does not exist" });

            for (const category of exam.Categories) {
                const parCategory = await ParentCategory.findByPk(category.id_par_category);
                category.dataValues[`${parCategory.name}`] = category.name;
                delete category.dataValues.name;
                delete category.dataValues.id_par_category;
            }

            res.status(200).json(exam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/exams/search/page/:page
    searchExam = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const { query } = req.query;

            const result = await index.search(query, {
                hitsPerPage: pageSize,
                page: currentPage - 1
            });

            res.status(200).json({
                result: result.hits,
                total: result.nbHits
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Create an exam
    // [POST] /api/v1/exams
    createExam = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;
        console.log(req.body.data);

        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

        const t = await sequelize.transaction();
        try {
            const { title, period, status, questions, id_course, categories } = body;
            const quantity_question = questions.length;
            const id_teacher = req.teacher.data.id;

            if (!title || !period) {
                return res.status(400).json({ message: "Information missed!" });
            }


            // if (categories === undefined || categories.length === 0) {
            //     return res.status(400).json({ message: "Category missed!" })
            // }

            // let categoryInstances: any[] = [];
            // for (const id of categories) {
            //     const category = await Category.findByPk(id);
            //     categoryInstances.push(category);
            //     console.log(categoryInstances);

            // }

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

            // await newExam.addCategories(categoryInstances, { transaction: t });


            for (const question of questions) {
                const { question_categories, knowledges, answers, ...questionBody } = question;

                if (answers === undefined || answers.length === 0) {
                    return res.status(400).json({
                        message: "Question must have its own answers!"
                    });
                }

                const questionDraft = await ExamDraft.findOne({
                    where: { id_question: questionBody.id }
                });

                let content_image = "";

                // If draft exist, means image of question has been uploaded
                if (questionDraft) {
                    content_image = questionDraft.url;
                    await questionDraft.destroy({ transaction: t });
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

                for (const answer of answers) {
                    let answer_image = "";

                    const answerDraft = await ExamDraft.findOne({
                        where: { id_answer: answer.id, type: "answer" }
                    });

                    if (answerDraft) {
                        answer_image = answerDraft.url;
                        await answerDraft.destroy({ transaction: t });
                    }

                    await Answer.create({
                        id_question: newQuestion.id,
                        ...answer,
                        content_image: answer_image
                    }, {
                        transaction: t
                    });
                }
            }

            await t.commit();

            // const Categories = categoryInstances.map(({ id, name }) => ({ id, name }));
            const user = { id: id_teacher, name: req.teacher?.data.name };

            const dataValues = newExam.dataValues;

            const algoliaDataSave = {
                ...dataValues,
                objectID: newExam.id,
                // Categories,
                user
            }

            // Save data to algolia
            await index.saveObject(algoliaDataSave);

            res.status(201).json(newExam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });

            await t.rollback();
        }
    }

    // [PUT] /api/v1/exams/:examId
    updateExam = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();

        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            let body = req.body.data;

            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            let { categories, questions, ...examBody } = body;
            const examId = req.params.examId;
            const exam = await Exam.findByPk(examId);
            let quantity_question = exam.quantity_question;

            let Categories: any[] = [];

            if (categories !== undefined && categories.length > 0) {
                const categoriesList: any[] = [];
                for (const category of categories) {
                    const categoryRecord = await Category.findByPk(category);
                    if (!categoryRecord) throw new Error("Category does not exist");
                    categoriesList.push(categoryRecord);
                }
                await exam.setCategories(categoriesList, { transaction: t });
                Categories = categoriesList.map(({ id, name }) => ({ id, name }));
            }

            if (questions !== undefined && questions.length > 0) {
                for (const question of questions) {
                    const { answers, modify, ...questionBody } = question;

                    // If data receive does not contain modify field, means this question does not need to be update, then continue the loop
                    if (modify === undefined) {
                        continue
                    }

                    // If question need to delete from the exam
                    else if (modify === "delete") {
                        const questionToDelete = await Question.findByPk(question.id);

                        if (!questionToDelete) throw new Error(`question with id ${question.id} does not exist`);
                        await questionToDelete.destroy({ transaction: t });
                        quantity_question--;
                    }

                    // If new question need to be add to exam
                    else if (modify === "create") {
                        if (answers === undefined || answers.length === 0) {
                            return res.status(400).json({
                                message: "Question must have its own answers!"
                            });
                        }
                        let questionUrl = "";
                        const questionDraft = await ExamDraft.findOne({
                            where: { id_question: question.id, type: "question" }
                        });
                        if (questionDraft) {
                            questionUrl = questionDraft.url;
                            await questionDraft.destroy({ transaction: t });
                        }
                        await Question.create({
                            ...questionBody,
                            id_exam: examId,
                            content_image: questionUrl,
                            id_teacher: exam.id_teacher
                        }, { transaction: t });
                        quantity_question++;

                        // Create new answers for question
                        for (const answer of answers) {
                            let answerUrl = "";
                            const answerDraft = await ExamDraft.findOne({
                                where: { id_answer: answer.id, type: "answer" }
                            });

                            if (answerDraft) {
                                answerUrl = answerDraft.url;
                                await answerDraft.destroy({ transaction: t });
                            }

                            await Answer.create({ ...answer, id_question: question.id, content_image: answerUrl }, { transaction: t });
                        }
                    }

                    // The last state of modify is change
                    else {
                        const questionToUpdate = await Question.findByPk(question.id);

                        let questionUrl = questionToUpdate.content_image;

                        const questionDraft = await ExamDraft.findOne({
                            where: { id_question: question.id, type: "question" }
                        });

                        if (questionDraft) {
                            questionUrl = questionDraft.url;
                            await questionDraft.destroy({ transaction: t });
                        }

                        await questionToUpdate.update({ content_image: questionUrl, ...questionBody }, { transaction: t });

                        // Update answers
                        for (const answer of answers) {
                            const { answerModify, ...answerBody } = answer;

                            // If modify is undefined, means this answer oes not need to update
                            if (answerModify === undefined) {
                                continue;
                            }

                            // If modify state is delete, means this answer will be delete
                            else if (answerModify === "delete") {
                                await Answer.destroy({
                                    where: { id: answer.id }
                                }, {
                                    transaction: t
                                });
                            }

                            // If modify state is create, means this question need to add new answer
                            else if (answerModify === "create") {
                                let answerUrl = "";
                                const answerDraft = await ExamDraft.findOne({
                                    where: { id_answer: answer.id, type: "answer" }
                                });

                                if (answerDraft) {
                                    answerUrl = answerDraft.url;
                                    await answerDraft.destroy({ transaction: t });
                                }

                                await Answer.create({
                                    ...answerBody,
                                    id_question: question.id,
                                    content_image: answerUrl
                                }, {
                                    transaction: t
                                });
                            }

                            // The last state of modify is change, means answers need to be update
                            else {
                                const answerToUpdate = await Answer.findByPk(answer.id)
                                let answerUrl = answerToUpdate.content_image;

                                const answerDraft = await ExamDraft.findOne({
                                    where: { id_answer: answer.id, type: "answer" }
                                });

                                if (answerDraft) {
                                    answerUrl = answerDraft.url;
                                    await answerDraft.destroy({ transaction: t });
                                }

                                await answerToUpdate.update({ content_image: answerUrl, ...answerBody }, { transaction: t });
                            }
                        }
                    }
                }
            }

            await exam.update({ quantity_question, ...examBody }, { transaction: t });

            await t.commit();

            const dataToUpdate = {
                ...examBody,
                objectID: examId,
                Categories
            }
            index.partialUpdateObject(dataToUpdate);

            res.status(200).json(exam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

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
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

        const t = await sequelize.transaction();
        try {
            const examId = req.params.examId;

            await Exam.destroy({
                where: { id: examId }
            }, {
                transaction: t
            });

            await t.commit();

            index.deleteObject(examId);

            res.status(200).json({
                examId,
                message: "Exam has been deleted",
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });

            await t.rollback();
        }
    }
}


module.exports = new ExamController();
