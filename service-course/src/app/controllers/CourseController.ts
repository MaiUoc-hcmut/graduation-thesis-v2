const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Topic = require('../../db/models/topic');
const Category = require('../../db/models/category');
const Review = require('../../db/models/review');
const ParentCategory = require('../../db/models/parent-category');
const CourseDraft = require('../../db/models/course_draft');
const Document = require('../../db/models/document');
const Forum = require('../../db/models/forum');

const StudentCourse = require('../../db/models/student-course');

require('dotenv').config();

const { Op } = require('sequelize');

const axios = require('axios');
import { Request, Response, NextFunction } from 'express';

const { sequelize } = require('../../config/db/index');

const { getVideoDurationInSeconds } = require('get-video-duration');

const algoliasearch = require('algoliasearch');

// const io = require('../../index');
// const clientsConnected = require('../../socket');

const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig } = require('../../config/firebase/firebase');
const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
    getStorage,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);
const storage = getStorage();

declare global {
    interface ImageURL {
        thumbnail: string;
        cover: string;
    }


    namespace Express {
        interface Request {
            URL: ImageURL;
            teacher?: any;
            student?: any;
            topicURL: ResponseVideoFile[];
        }

    }

    type ResponseVideoFile = {
        name: string,
        url: string,
        chapterIdx: number,
        topicIdx: number,
        duration: number,
    }

    interface RequestForCourse extends Request {
        URL: ImageURL;
        teacher?: any;
        topicURL: ResponseVideoFile[];
        file: Express.Multer.File;
        files: Express.Multer.File[];
    }
}

class CourseController {

    // Get all courses
    // [GET] /courses
    getAllCourse = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const courses = await Course.findAll({
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

            for (const course of courses) {
                const user = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${course.id_teacher}`);
                course.dataValues.user = { id: user.data.id, name: user.data.name };
            }

            res.status(200).json(courses)
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // Get course by Id
    // [GET] /courses/:courseId
    getCourseById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.params.id;
            const course = await Course.findByPk(id);

            if (!course) return res.status(404).json({ message: "Course not found!" });

            res.status(200).json(course);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /courses/search/page/:page
    searchCourse = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const query = req.query.query;

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
            res.status(500).json({ error });
        }
    }

    // [GET] /courses/search/teacher/:teacherId/page/:page
    searchCourseOfTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            const id_teacher = req.params.teacherId;
            const query = req.query.query;

            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const filters = `id_teacher:${id_teacher}`;

            const result = await index.search(query, {
                filters,
                hitsPerPage: pageSize,
                page: currentPage - 1
            });

            res.status(200).json({
                total: result.nbHits,
                result: result.hits
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /courses/full/:courseId
    getAllDetailCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const course = await Course.findOne({
                where: { id: req.params.courseId },
                include: [
                    {
                        model: Chapter,
                        as: 'chapters',
                        include: [
                            {
                                model: Topic,
                                as: 'topics',
                                include: [
                                    {
                                        model: Document,
                                        attributes: ['id', 'url', 'name'],
                                        through: {
                                            attributes: []
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: Category,
                        attributes: ['name', 'id_par_category', 'id'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            if (!course) return res.status(404).json({ message: "Course does not exist" });

            for (const category of course.Categories) {
                const parCategory = await ParentCategory.findByPk(category.id_par_category);
                category.dataValues[`${parCategory.name}`] = category.name;
                delete category.dataValues.name;
                delete category.dataValues.id_par_category;
            }

            course.chapters.sort((a: any, b: any) => a.order - b.order);

            course.chapters.forEach((chapter: any) => {
                chapter.topics.sort((a: any, b: any) => a.order - b.order);
            });
            course.chapters.forEach((chapter: any) => {
                let totalChapterDuration = 0;
                let totalChapterLectures = 0;
                let totalChapterExams = 0;
                chapter.topics.forEach((topic: any) => {
                    totalChapterDuration += topic.duration;
                    topic.type === "lecture" ? totalChapterLectures++ : totalChapterExams++; 
                });
                chapter.dataValues.totalDuration = totalChapterDuration;
                chapter.dataValues.totalChapterLectures = totalChapterLectures;
                chapter.dataValues.totalChapterExams = totalChapterExams;
            });

            res.status(200).json(course);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /courses/filter
    getCourseFilterByCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const categories = Object.values(req.query);
            
            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Course.count({
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

            const courses = await Course.findAll({
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

            res.status(200).json({ count: count.length, courses });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // Get all courses that created by a teacher
    // [GET] /courses/teacher/:teacherId/page/:page
    getCourseCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            // Count all the record that match the condition
            const count = await Course.count({
                where: { id_teacher }
            });

            // Response the result with the limit for pagination
            const courses = await Course.findAll({
                where: { id_teacher },
                include: [
                    {
                        model: Category,
                        attributes: ['name', 'id_par_category'],
                        through: {
                            attributes: []
                        }
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            for (const course of courses) {
                // Format category before response
                for (const category of course.Categories) {
                    const parCategory = await ParentCategory.findByPk(category.id_par_category);
                    category.dataValues[`${parCategory.name}`] = category.name;

                    delete category.dataValues.name;
                    delete category.dataValues.id_par_category;
                }

                const reviews = await Review.findAll({
                    where: { id_course: course.id },
                    attributes: ['rating'],
                    through: {
                        attributes: []
                    }
                });
                let averageRating = 0
                if (reviews.length > 0) {
                    averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
                }
                course.dataValues.averageRating = averageRating;
            }

            res.status(200).json({ count, courses });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /courses/student/:studentId/page/:page
    getCourseStudentPaid = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;

            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await StudentCourse.count({
                where: { id_student }
            });

            const courses = await StudentCourse.findAll({
                where: { id_student },
                attributes: ['createdAt'],
                through: {
                    attributes: []
                },
                include: [
                    {
                        model: Course
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            res.status(200).json({ count, courses });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }

    // [POST] /courses/:courseId
    studentBuyACourse = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_student = req.student.data.id;
            const id_course = req.params.courseId;

            await StudentCourse.create({
                id_student,
                id_course
            }, {
                transaction: t
            });

            await t.commit();

            res.status(201).json({
                message: "Student has been bought the course!"
            });
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });

            await t.rollback();
        }
    }

    // [POST] /courses
    createCourse = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;

        if (typeof(body) == 'string') {
            body = JSON.parse(body);
        }
        
        let { chapters, categories, id, ...courseBody } = body;

        const t = await sequelize.transaction();

        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

        try {
            const id_teacher = req.teacher.data.id;
            
            // check if there are no start and end time
            if (!courseBody.start_time || !courseBody.end_time) {
                throw new Error("Time landmark missed!");
            }

            if (!categories) {
                throw new Error("Categories missed!");
            }

            let thumbnail = "";
            let cover_image = "";
            
            // Query thumbnail and cover image that created in draft table before
            const thumbnailDraft = await CourseDraft.findOne({
                where: { 
                    id_course: id,
                    type: "thumbnail"
                }
            });
            
            const coverDraft = await CourseDraft.findOne({
                where: {
                    id_course: id,
                    type: "cover"
                }
            });

            if (thumbnailDraft) {
                thumbnail = thumbnailDraft.url;
                await thumbnailDraft.destroy({ transaction: t });
            }

            if (coverDraft) {
                cover_image = coverDraft.url;
                await coverDraft.destroy({ transaction: t });
            }

            let totalLecture = 0;
            let totalExam = 0;
            let totalChapter = 0;
            let totalDuration = 0;

            courseBody.start_time = new Date(courseBody.start_time);
            courseBody.end_time = new Date(courseBody.end_time);

            const newCourse = await Course.create({
                id,
                thumbnail,
                cover_image,
                ...courseBody,
                id_teacher
            }, {
                transaction: t
            });

            const newForum = await Forum.create({ id_course: newCourse.id }, { transaction: t });

            const categoriesInstances = [];

            for (let i = 0; i < categories.length; i++) {
                const category = await Category.findByPk(categories[i]);
                categoriesInstances.push(category);
            }

            await newCourse.addCategories(categoriesInstances, { transaction: t });

            // If course contain chapters
            if (chapters !== undefined) {
                totalChapter = chapters.length;
                for (let i = 0; i < chapters.length; i++) {
                    const newChapter = await Chapter.create({
                        name: chapters[i].name,
                        id_course: id,
                        status: chapters[i].status,
                        order: i + 1
                    }, {
                        transaction: t
                    });
    
                    // If chapter contain topics
                    if (chapters[i].topics !== undefined) {
                        totalLecture += chapters[i].topics.filter((topic: any) => topic.type === "lecture").length;
                        totalExam += chapters[i].topics.filter((topic: any) => topic.type === "exam").length;
                        for (let j = 0; j < chapters[i].topics.length; j++) {
                            // If topic is an exam
                            if (chapters[i].topics[j].type === "exam") {
                                const headers = {
                                    'Content-Type': 'application/json',
                                    'Authorization': req.headers.authorization
                                }
                                chapters[i].topics[j].exam.data.categories = categories;
                                chapters[i].topics[j].exam.data.id_course = newCourse.id;
                                chapters[i].topics[j].exam.data.title = chapters[i].topics[j].name;
                                const exam = await axios.post(
                                    `${process.env.BASE_URL_EXAM_LOCAL}/exams`,
                                    chapters[i].topics[j].exam,
                                    { headers }
                                );

                                await Topic.create({
                                    id_chapter: newChapter.id,
                                    id_exam: exam.data.id,
                                    name: chapters[i].topics[j].name,
                                    description: chapters[i].topics[j].description,
                                    order: j + 1,
                                    status: chapters[i].topics[j].status,
                                    type: "exam",
                                }, {
                                    transaction: t
                                });

                                continue;
                            }

                            let topicVideoURL = "";
                            let topicVideoDuration = 0;
        
                            const topicDraft = await CourseDraft.findOne({
                                where: {
                                    id_course: id,
                                    topic_order: j + 1,
                                    chapter_order: i + 1,
                                    type: "lecture"
                                }
                            });
        
                            if (topicDraft) {
                                topicVideoURL = topicDraft.url;
                                topicVideoDuration = topicDraft.duration;
                                await topicDraft.destroy({ transaction: t });
                            }

                            const documentsDraft = await CourseDraft.findAll({
                                where: {
                                    id_course: id,
                                    topic_order: j + 1,
                                    chapter_order: i + 1,
                                    type: "document"
                                }
                            });

                            const newTopic = await Topic.create({
                                id_chapter: newChapter.id,
                                video: topicVideoURL,
                                name: chapters[i].topics[j].name,
                                description: chapters[i].topics[j].description,
                                order: j + 1,
                                status: chapters[i].topics[j].status,
                                duration: topicVideoDuration,
                                type: "lecture",
                            }, {
                                transaction: t
                            });

                            if (documentsDraft.length > 0) {
                                let documentInstances = [];
                                for (const docDraft of documentsDraft) {
                                    const document = await Document.findByPk(docDraft.id_document);
                                    documentInstances.push(document);
                                    await docDraft.destroy({ transaction: t });
                                }

                                if (documentInstances.length > 0) {
                                    await newTopic.addDocuments(documentInstances, { transaction: t });
                                }
                            }
                            
                            totalDuration += topicVideoDuration;
                        }
                    }
                }
            }

            await newCourse.update({ 
                total_lecture: totalLecture, 
                total_exam: totalExam,
                total_chapter: totalChapter,
                total_duration: totalDuration
            }, { 
                transaction: t 
            });

            
            const data = {
                id_user: id_teacher,
                id_course: newCourse.id,
                name: newCourse.name
            }

            const response = await axios.get(`${process.env.BASE_URL_NOTIFICATION_LOCAL}/notification/create-course`, { data });

            await t.commit();

            const Categories = categoriesInstances.map(({ id, name }) => ({ id, name }));
            const user = { id: id_teacher, name: req.teacher?.data.name };

            const dataValues = newCourse.dataValues;

            const algoliaDataSave = {
                ...dataValues,
                objectID: newCourse.id,
                Categories,
                user
            }

            newCourse.dataValues.id_forum = newForum.id;

            // Save data to algolia
            await index.saveObject(algoliaDataSave);

            res.status(201).json(newCourse);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            const thumbnailDraft = await CourseDraft.findOne({
                where: { 
                    id_course: id,
                    type: "thumbnail"
                }
            });

            const coverDraft = await CourseDraft.findOne({
                where: {
                    id_course: id,
                    type: "cover"
                }
            });

            // const thumbnailRef = ref(thumbnailDraft.url);
            // const coverRef = ref(coverDraft.url);
            // await deleteObject(thumbnailRef);
            // await deleteObject(coverRef);

            if (thumbnailDraft) {
                await thumbnailDraft.destroy();
            }

            if (coverDraft) {
                await coverDraft.destroy();
            }

            // const topicsDraft = await CourseDraft.findAll({
            //     where: { id_course: id }
            // });

            // const deletePromises = topicsDraft.map(async (topicDraft: any) => {
            //     const videoRef = ref(topicDraft.url);
            //     await deleteObject(videoRef);
            // })

            // Promise.all(deletePromises);

            await t.rollback();
        }
    }

    uploadThumbnailAndCover = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            
            const dateTime = fileUpload.giveCurrentDateTime();

            if (!files.thumbnail[0].mimetype.startsWith('image/')) {
                return res.status(400).json({
                    message: "Invalid mimetype for thumbnail"
                });
            }

            if (!files.cover[0].mimetype.startsWith('image/')) {
                return res.status(400).json({
                    message: "Invalid mimetype for cover image"
                });
            }

            const thumbnailRef = ref(
                storage,
                `thumbnails course/${files.thumbnail[0].originalname + '       ' + dateTime}`
            );
            const coverRef = ref(
                storage,
                `cover image course/${files.cover[0].originalname + '       ' + dateTime}`
            );

            // Create file metadata including the content type
            const metadataThumbnail = {
                contentType: files.thumbnail[0].mimetype,
            };
            const metadataCover = {
                contentType: files.cover[0].mimetype,
            };

            // Upload the file in the bucket storage
            const thumbnailSnapshot = await uploadBytesResumable(
                thumbnailRef,
                files.thumbnail[0].buffer,
                metadataThumbnail
            );

            const coverSnapshot = await uploadBytesResumable(
                coverRef,
                files.cover[0].buffer,
                metadataCover
            );

            // Grab the public url
            const thumbnailURL = await getDownloadURL(thumbnailSnapshot.ref);
            const coverURL = await getDownloadURL(coverSnapshot.ref);

            const URL = {
                thumbnail: thumbnailURL,
                cover: coverURL
            };

            req.URL = URL;

            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    uploadLectureVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const urls: ResponseVideoFile[] = [];

            const mimetypeErrorResponse: {
                message?: string,
                file?: string
            }[] = [];

            if (files.video === undefined || files.video.length === 0) {
                next();
            }

            files.video.map(video => {
                if (!video.mimetype.startsWith('video/')) {
                    mimetypeErrorResponse.push({
                        message: "Invalid mimetype for video lecture",
                        file: `${video.originalname}`
                    });
                }
            })

            if (mimetypeErrorResponse.length > 0) {
                res.status(400).json(mimetypeErrorResponse);
                const thumbnailRef = ref(req.URL.thumbnail);
                const coverRef = ref(req.URL.cover);
                await deleteObject(thumbnailRef);
                await deleteObject(coverRef);
                return 
            }

            const uploadPromises = files.video.map(async (video) => {
                const dateTime = fileUpload.giveCurrentDateTime();

                // originalname of video is separate to 3 part
                // each part separate by a hyphen
                // first part is index of chapter in course, second part is index of topic in chapter
                const firstHyphen = video.originalname.indexOf('-');
                const chapterIdx = video.originalname.substring(0, firstHyphen);

                const secondHyphen = video.originalname.indexOf('-', firstHyphen + 1);
                const topicIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);

                const originalFileName = video.originalname.substring(secondHyphen + 1);

                const storageRef = ref(
                    storage, 
                    `video course/${originalFileName + "       " + dateTime}`
                );

                const metadata = {
                    contentType: video.mimetype,
                };

                const snapshot = await uploadBytesResumable(storageRef, video.buffer, metadata);
                const url = await getDownloadURL(snapshot.ref);
                const duration = await getVideoDurationInSeconds(url);

                urls.push({
                    name: originalFileName,
                    url,
                    chapterIdx: parseInt(chapterIdx),
                    topicIdx: parseInt(topicIdx),
                    duration: Math.floor(duration)
                });
                // io.to(clientsConnected[req.teacher.data.id]).emit("file uploaded", {
                //     fileName: originalFileName,
                //     url
                // });
            });
            
            await Promise.all(uploadPromises);

            req.topicURL = urls;
            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [PUT] /courses/:courseId
    updateCourse = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();

        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            let body = req.body.data;

            if (typeof body === "string") {
                body = JSON.parse(body);
            }
            
            let { chapters, categories, ...courseBody } = body;

            const courseId = req.params.courseId;

            const course = await Course.findByPk(courseId);

            // Find if thumbnail or cover need to update
            const thumbnailDraft = await CourseDraft.findOne({
                where: {
                    id_course: courseId,
                    type: "thumbnail"
                }
            });

            const coverDraft = await CourseDraft.findOne({
                where: {
                    id_course: courseId,
                    type: "cover"
                }
            });

            let thumbnail = course.thumbnail;
            let cover = course.cover_image;

            if (thumbnailDraft) {
                thumbnail = thumbnailDraft.url;
                await thumbnailDraft.destroy({ transaction: t });
            }

            if (coverDraft) {
                cover = coverDraft.url;
                await coverDraft.destroy({ transaction: t });
            }

            if (courseBody !== undefined) {
                await course.update({ ...courseBody, thumbnail, cover_image: cover }, { transaction: t });
            }

            // Categories to update to algolia
            let Categories: any[] = [];

            // If categories need to update
            if (categories !== undefined) {
                const categoriesList: any[] = [];
                for (const category of categories) {
                    const categoryRecord = await Category.findByPk(category);
                    if (!categoryRecord) throw new Error("Category does not exist");
                    categoriesList.push(categoryRecord);
                }
                await course.setCategories(categoriesList, { transaction: t });
                Categories = categoriesList.map(({ id, name }) => ({ id, name }));
            }
            // If chapter need to update
            if (chapters !== undefined) {
                let i = 1;
                let totalLecture = course.total_lecture;
                let totalExam = course.total_exam;
                for (const chapter of chapters) {

                    const { topics, ...chapterBody } = chapter;
                    
                    // If chapter does not have id, it's means the new chapter will be add to course
                    if (chapterBody.id === undefined) {
                        const newChapter = await Chapter.create({
                            ...chapterBody,
                            id_course: courseId,
                            order: i
                        }, {
                            transaction: t
                        });

                        // If topics is contain in data to add
                        if (topics !== undefined) {
                            let j = 1;
                            for (const topic of topics) {

                                // Check if the video has been uploaded or not
                                const topicDraft = await CourseDraft.findOne({
                                    where: { 
                                        id_topic: topic.id,
                                        type: "lecture"
                                    }
                                });

                                const documentsDraft = await CourseDraft.All({
                                    where: {
                                        id_topic: topic.id,
                                        type: "document"
                                    }
                                })

                                let videoTopicUrl = "";
                                let videoTopicDuration = 0;

                                // If video of topic has been uploaded, then assign the url and duration to variable to create new topic
                                if (topicDraft) {
                                    videoTopicUrl = topicDraft.url;
                                    videoTopicDuration = topicDraft.duration;
                                }

                                let documentInstances = [];

                                if (documentsDraft.length > 0) {
                                    for (const docDraft of documentsDraft) {
                                        const document = await Document.findByPk(docDraft.id_document);
                                        documentInstances.push(document);

                                        await docDraft.destroy({ transaction: t });
                                    }
                                }

                                const newTopic = await Topic.create({
                                    id_chapter: newChapter.id,
                                    ...topic,
                                    video: videoTopicUrl,
                                    duration: videoTopicDuration,
                                    order: j,
                                }, {
                                    transaction: t
                                });
                                topic.type === "lecture" ? totalLecture++ : totalExam++;
                                j++;

                                newTopic.addDocuments(documentInstances);
                            }
                        }
                        i++;
                        continue;
                    }

                    // If chapter does not contain modify field, means this chapter does not need to be update or just update the order
                    if (chapter.modify === undefined){
                        await Chapter.update({
                            order: i
                        },{
                            where: { id: chapter.id }
                        }, {
                            transaction: t
                        });

                        i++;
                        continue;
                    }

                    // If the modify state of chapter is "delete", means this chapter need to be delete
                    if (chapter.modify === "delete") {
                        totalLecture -= chapter.topics?.filter((topic: any) => topic.type === "lecture").length;
                        totalExam -= chapter.topics?.filter((topic: any) => topic.type === "exam").length;

                        const chapterToDelete = await Chapter.findByPk(chapter.id);
                        
                        if (!chapterToDelete) throw new Error(`Chapter with id ${chapter.id} does not exist`);
                        await chapterToDelete.destroy({ transaction: t });
                        continue;
                    }

                    // If chapterBody have id field, means chapter already exist, check the id is valid or not
                    const chapterToUpdate = await Chapter.findByPk(chapterBody.id);

                    // If id is not valid, means the id provided by FE does not match any chapter, throw the error
                    if (!chapterToUpdate) throw new Error(`Chapter with id ${chapter.id} does not exist`);

                    await chapterToUpdate.update({ ...chapterBody, order: i }, { transaction: t });

                    // If topics need to update
                    if (topics !== undefined) {
                        let j = 1;
                        for (const topic of topics) {
                            // If topic does not have id, means new topic will be add
                            if (topic.modify === "create") {
                                const topicDraft = await CourseDraft.findOne({
                                    where: { 
                                        id_topic: topic.id,
                                        type: "lecture"
                                    },
                                });

                                const documentsDraft = await CourseDraft.findAll({
                                    where: {
                                        id_topic: topic.id,
                                        type: "document"
                                    }
                                })

                                // If draft does not exist, means the video is not uploaded yet
                                let videoTopicUrl = "";
                                let videoTopicDuration = 0;

                                if (topicDraft) {
                                    videoTopicUrl = topicDraft.url;
                                    videoTopicDuration = topicDraft.duration;
                                }

                                let documentInstances = [];

                                if (documentsDraft.length > 0) {
                                    for (const docDraft of documentsDraft) {
                                        const document = await Document.findByPk(docDraft.id_document);
                                        documentInstances.push(document);

                                        await docDraft.destroy({ transaction: t });
                                    }
                                }

                                const newTopic = await Topic.create({
                                    id_chapter: chapter.id,
                                    ...topic,
                                    video: videoTopicUrl,
                                    duration: videoTopicDuration,
                                    order: j,
                                }, {
                                    transaction: t
                                });

                                topic.type === "lecture" ? totalLecture++ : totalExam++;
                                await newTopic.addDocuments(documentInstances);
                                j++;
                                continue;
                            }

                            // Topic just need to update order or does not need to be update
                            if (topic.modify === undefined) {
                                await Topic.update({
                                    order: j
                                }, {
                                    where: { id: topic.id }
                                }, {
                                    transaction: t
                                });

                                j++;
                                continue;
                            }

                            // Topic need to delete
                            if (topic.modify === "delete") {
                                await Topic.destroy({
                                    where: { id: topic.id }
                                }, {
                                    transaction: t
                                });

                                topic.type === "lecture" ? totalLecture-- : totalExam--;
                                continue;
                            }

                            const topicToUpdate = await Topic.findByPk(topic.id);

                            if (!topicToUpdate) throw new Error("Topic does not exist");

                            const lectureDraft = await CourseDraft.findOne({
                                where: {
                                    id_topic: topic.id,
                                    type: "lecture",
                                }
                            });

                            const documentsDraft = await CourseDraft.findAll({
                                where: {
                                    id_topic: topic.id,
                                    type: "document",
                                }
                            });

                            let video = topicToUpdate.video;
                            let documentInstances = [];

                            if (lectureDraft) {
                                video = lectureDraft.url;
                                await lectureDraft.destroy({ transaction: t });
                            }

                            if (documentsDraft.length > 0) {
                                for (const docDraft of documentsDraft) {
                                    const document = await Document.findByPk(docDraft.id_document);
                                    documentInstances.push(document);
                                }
                                await topicToUpdate.setDocuments(documentInstances, { transaction: t });
                            }
                            await topicToUpdate.update({ ...topic, order: j, video }, { transaction: t });
                            j++;
                        }
                    }
                    i++;
                }

                await course.update({
                    total_lecture: totalLecture,
                    total_exam: totalExam,
                }, {
                    transaction: t
                });
            }

            await t.commit();
            const dataToUpdate = {
                ...courseBody,
                objectID: courseId,
                Categories
            }
            await index.partialUpdateObject(dataToUpdate);
            res.status(200).json(course);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
            await t.rollback();
        }
    }

    // [DELETE] /courses/:courseId
    deleteCourse = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

        const t = await sequelize.transaction();
        try {
            const id_course = req.params.courseId;

            await Course.destroy({
                where: { id: id_course }
            }, {
                transaction: t
            });

            await Forum.destroy({
                where: { id_course }
            }, {
                transaction: t
            });

            await t.commit();

            index.deleteObject(req.params.courseId);

            res.status(200).json({
                id: req.params.courseId,
                message: "Course has been deleted"
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    test = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
            const urls: ResponseVideoFile[] = [];
    
            const uploadPromises = files.video.map(async (video) => {
                const dateTime = fileUpload.giveCurrentDateTime();
    
                const firstHyphen = video.originalname.indexOf('-');
                const chapterIdx = video.originalname.substring(0, firstHyphen);
    
                const secondHyphen = video.originalname.indexOf('-', firstHyphen + 1);
                const topicIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);
    
                const originalFileName = video.originalname.substring(secondHyphen + 1);
    
                const storageRef = ref(
                    storage, 
                    `video course/${originalFileName + "       " + dateTime}`
                );
    
                const metadata = {
                    contentType: video.mimetype,
                };
    
                // Theo dõi tiến trình tải lên
                const snapshot = await uploadBytesResumable(storageRef, video.buffer, metadata);
                const url = await getDownloadURL(snapshot.ref);
                let duration = await getVideoDurationInSeconds(url);
                duration = Math.floor(duration);

                console.log({url, duration})

                urls.push({
                    name: originalFileName,
                    url,
                    chapterIdx: parseInt(chapterIdx),
                    topicIdx: parseInt(topicIdx),
                    duration
                });
            });
            
            await Promise.all(uploadPromises);
    
            res.json(urls)
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

}

module.exports = new CourseController();
