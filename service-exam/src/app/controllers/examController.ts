const Exam = require('../../db/model/exam');
const Question = require('../../db/model/question');
const Answer = require('../../db/model/answer');
const Category = require('../../db/model/category');
const ParentCategory = require('../../db/model/par_category');
const ExamDraft = require('../../db/model/exam_draft');
const Knowledge = require('../../db/model/knowledge');
const Error = require('../../db/model/error');
const { Op } = require("sequelize");

const algoliasearch = require('algoliasearch');

const { sequelize } = require('../../config/db/index');
const axios = require('axios');

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

            const isAll = req.query.all;
            let option = "delete";
            if (isAll !== undefined && isAll === "1") {
                option = ""
            }

            const exam = await Exam.findByPk(id_exam, {
                include: [
                    {
                        model: Question,
                        where: { 
                            status: {
                                [Op.ne]: `${option}`
                            }
                        },
                        as: 'questions',
                        include: [
                            {
                                model: Answer,
                                as: 'answers'
                            },
                            {
                                model: Knowledge,
                                attributes: ['name'],
                                through: {
                                    attributes: []
                                }
                            },
                            {
                                model: Error
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

            let knowledges: {
                name: string,
                questions: string[]
            }[] = [];
            for (const question of exam.questions) {
                if (question.Knowledge.length === 0) {
                    const foundObject = knowledges.find(o => o.name === "other");
                    if (!foundObject) {
                        knowledges.push({
                            name: "other",
                            questions: [question.id]
                        });
                    } else {
                        foundObject.questions.push(question.id);
                    }
                    continue;
                }

                for (const knowledge of question.Knowledge) {
                    const foundObject = knowledges.find(o => o.name === knowledge.name);
                    if (!foundObject) {
                        knowledges.push({
                            name: knowledge.name,
                            questions: [question.id]
                        });
                    } else {
                        foundObject.questions.push(question.id);
                    }
                }
            }

            for (const category of exam.Categories) {
                const parCategory = await ParentCategory.findByPk(category.id_par_category);
                category.dataValues[`${parCategory.name}`] = category.name;
                delete category.dataValues.name;
                delete category.dataValues.id_par_category;
            }

            exam.dataValues.classification = knowledges;

            res.status(200).json(exam);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/exams/filter/page/:page
    getFilteredExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const categories = Object.values(req.query);

            const { class: _class, subject, level } = req.query;

            if (Array.isArray(_class)) {
                categories.push(..._class)
            } else {
                categories.push(_class)
            }

            if (Array.isArray(subject)) {
                categories.push(...subject)
            } else {
                categories.push(subject)
            }

            if (Array.isArray(level)) {
                categories.push(...level)
            } else {
                categories.push(level)
            }

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Exam.count({
                where: {
                    id_course: {
                        [Op.or]: [null, ""]
                    }
                },
                include: [
                    {
                        model: Category,
                        where: {
                            id: {
                                [Op.in]: categories,
                            },
                        },
                        through: {
                            attributes: [],
                        },
                    },
                ],
                group: ['Course.id'],
                having: sequelize.literal("COUNT(DISTINCT "+`Categories`+"."+`id`+`) = ${categories.length}`),
                raw: true
            });

            const exams = await Exam.findAll({
                where: {
                    id_course: {
                        [Op.or]: [null, ""]
                    }
                },
                include: [
                    {
                        model: Category,
                        where: {
                            id: {
                                [Op.in]: categories,
                            },
                        },
                        attributes: ['name', 'id'],
                        through: {
                            attributes: [],
                        },
                    },
                ],
                group: ['Course.id'],
                having: sequelize.literal("COUNT(DISTINCT "+`Categories`+"."+`id`+`) = ${categories.length}`),
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                subQuery: false
            });

            
            for (const exam of exams) {
                const user = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${exam.id_teacher}`);
                exam.dataValues.user = { id: user.data.id, name: user.data.name };

                for (const category of exam.Categories) {
                    const parCategory = await ParentCategory.findByPk(category.id_par_category);
                    category.dataValues[`${parCategory.name}`] = category.name;
                    delete category.dataValues.name;
                    delete category.dataValues.id_par_category;
                }
            }

            res.status(200).json({
                count,
                exams
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
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

            const filters = `id_course:${null}`;

            const result = await index.search(query, {
                hitsPerPage: pageSize,
                page: currentPage - 1,
                filters
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

    // [GET] /api/v1/exams/search/teacher/:teacherId/page/:page
    searchExamOfTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const { query } = req.query;

            
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

        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        
        const t = await sequelize.transaction();
        try {
            const { title, period, status, questions, id_course, categories, pass_score } = body;
            const quantity_question = questions.length;
            const id_teacher = req.teacher.data.id;

            if (!title || !period) {
                return res.status(400).json({ message: "Information missed!" });
            }
                
            if (!categories) {
                return res.status(400).json({ message: "Category missed!" });
            }

            if (!questions) {
                return res.status(400).json({ message: "Questions missed!" });
            }

            if (!pass_score) {
                return res.status(400).json({ message: "Pass score missed!"});
            }

            if (pass_score < 0 || pass_score > 10) {
                return res.status(400).json({ message: "Pass score must be in range 0 to 10" });
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
                
                if (!answers) {
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

                if (question_categories) {
                    let questionCategoryInstances: any[] = [];
                    for (const id of question_categories) {
                        const category = await Category.findByPk(id);
                        questionCategoryInstances.push(category);
                    }

                    newQuestion.addCategories(questionCategoryInstances, { transaction: t });
                }

                if (knowledges) {
                    for (const id of knowledges) {
                        const knowledge = await Knowledge.findByPk(id);

                        if (!knowledge) {
                            return res.status(400).json({
                                message: "Knowledge does not exist!",
                                knowledge: id
                            });
                        }
                        await newQuestion.addKnowledge(knowledge, { transaction: t });
                    }
                }

                const rightAnswer = answers.filter((answer: any) => answer.is_correct === true);
                if (!rightAnswer) {
                    return res.status(400).json({
                        message: "Ques tion must have at least 1 right answer",
                        question
                    });
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

            const data = {
                id_user: id_teacher,
                id_exam: newExam.id,
                name: newExam.title
            }

            const response = await axios.get(`${process.env.BASE_URL_NOTIFICATION_LOCAL}/notification/create-exam`, { data });

            await t.commit();

            const Categories = categoryInstances.map(({ id, name }) => ({ id, name }));
            const user = { id: id_teacher, name: req.teacher?.data.name };

            const dataValues = newExam.dataValues;

            const algoliaDataSave = {
                ...dataValues,
                objectID: newExam.id,
                Categories,
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

                        // Update status of this question to delete
                        await questionToDelete.update({
                            status: "delete"
                        }, {
                            transaction: t
                        });
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

                        questionBody.content_image = questionUrl;
                        if (questionBody.id !== undefined) {
                            delete questionBody.id;
                        }

                        // create new question with the same data as old question
                        const newQuestion = await Question.create({
                            ...questionBody
                        }, {
                            transaction: t
                        });

                        // Update status of old question to delete
                        await questionToUpdate.update({ status: "delete" }, { transaction: t });

                        // create new answers with the same data as old answers
                        for (const answer of answers) {
                            const { answerModify, ...answerBody } = answer;

                            // If answerModify state is delete, skip this answer
                            if (answerModify === "delete") {
                                continue;
                            }

                            let answerUrl = "";
                            const answerDraft = await ExamDraft.findOne({
                                where: { id_answer: answer.id, type: "answer" }
                            });

                            if (answerDraft) {
                                answerUrl = answerDraft.url;
                                await answerDraft.destroy({ transaction: t });
                            }

                            if (answerBody.id_question !== undefined) {
                                delete answerBody.id_question;
                            }

                            if (answerBody.id !== undefined) {
                                delete answerBody.id;
                            }

                            await Answer.create({
                                ...answerBody,
                                id_question: newQuestion.id,
                                content_image: answerUrl
                            }, {
                                transaction: t
                            });
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
            res.status(500).json({ error, message: error.message });

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
