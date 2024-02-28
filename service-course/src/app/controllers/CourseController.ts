const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Lecture = require('../../db/models/lecture');
const Category = require('../../db/models/category');
const Review = require('../../db/models/review');
const ParentCategory = require('../../db/models/parent-category');
const CourseDraft = require('../../db/models/course_draft');

import { Request, Response, NextFunction } from 'express';

const { sequelize } = require('../../config/db/index');

const { getVideoDurationInSeconds } = require('get-video-duration');

const io = require('../../index');
const clientsConnected = require('../../socket');

const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig } = require('../../config/firebase/firebase');
const admin = require('firebase-admin');
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
            lectureURL: ResponseVideoFile[];
        }

    }

    type ResponseVideoFile = {
        name: string,
        url: string,
        chapterIdx: number,
        lectureIdx: number,
        duration: number,
    }

    interface RequestForCourse extends Request {
        URL: ImageURL;
        teacher?: any;
        lectureURL: ResponseVideoFile[];
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
                        attributes: ['name'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

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
                                model: Lecture,
                                as: 'lectures'
                            }
                        ]
                    },
                    {
                        model: Category,
                        attributes: ['name', 'id_par_category'],
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
                chapter.lectures.sort((a: any, b: any) => a.order - b.order);
            });

            let totalCourseDuration = 0;
            let totalLectures = 0;
            course.chapters.forEach((chapter: any) => {
                let totalChapterDuration = 0;
                chapter.lectures.forEach((lecture: any) => {
                    totalChapterDuration += lecture.duration;
                });
                chapter.dataValues.totalDuration = totalChapterDuration;
                totalCourseDuration += totalChapterDuration;
                totalLectures += chapter.lectures.length;
            });
            course.dataValues.totalDuration = totalCourseDuration;
            course.dataValues.totalLectures = totalLectures;

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

            const courses = await Course.findAll({
                include: [
                    {
                        model: Category,
                        where: {
                            id: categories
                        },
                        attributes: ['name', 'id'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            const filteredCourses = courses.filter((course: any) => {
                const courseCategoryIds = course.Categories.map((category: any) => category.id);
                return categories.every(categoryId => courseCategoryIds.includes(categoryId));
            });

            res.status(200).json(filteredCourses);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // Get all courses that created by a teacher
    // [GET] /courses/teacher/:teacherId
    getCourseCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

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
                ]
            });

            for (const course of courses) {
                for (const category of course.Categories) {
                    const parCategory = await ParentCategory.findByPk(category.id_par_category);
                    category.dataValues[`${parCategory.name}`] = category.name;
                    delete category.dataValues.name;
                    delete category.dataValues.id_par_category;
                }

                let totalLectures = 0;

                course.chapters.forEach((chapter: any) => {
                    totalLectures += chapter.lectures.length;
                });
            }

            res.status(200).json(courses);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /courses
    createCourse = async (req: Request, res: Response, _next: NextFunction) => {
        let newCourse;
        
        let body = req.body.data;

        body = JSON.parse(body);
        
        let { chapters, categories, ...courseBody } = body;

        const t = sequelize.transaction();

        try {
            const id_teacher = req.teacher.data.id;

            // let body = req.body;

            // let { chapters, categories, ...courseBody } = body;

            // chapters = JSON.parse(chapters);
            // categories = JSON.parse(categories);

            
            // Query thumbnail and cover image that created in draft table before
            const thumbnailDraft = CourseDraft.findOne({
                where: { 
                    id_course: courseBody.id,
                    type: "thumbnail"
                }
            });

            const coverDraft = CourseDraft.findOne({
                where: {
                    id_course: courseBody.id,
                    type: "cover"
                }
            });

            newCourse = await Course.create({
                thumbnail: "",
                cover_image: "",
                ...courseBody,
                id_teacher
            }, {
                transaction: t
            });

            const categoriesInstances = [];

            for (let i = 0; i < categories.length; i++) {
                const category = await Category.findByPk(categories[i]);
                categoriesInstances.push(category);
            }

            newCourse.addCategories(categoriesInstances, { transaction: t });

            if (chapters !== undefined) {
                for (let i = 0; i < chapters.length; i++) {
                    const newChapter = await Chapter.create({
                        name: chapters[i].name,
                        id_course: newCourse.id,
                        status: chapters[i].status,
                        order: i + 1
                    }, {
                        transaction: t
                    });
    
                    if (chapters[i].lectures !== undefined) {
                        for (let j = 0; j < chapters[i].lectures.length; j++) {
                            let lectureVideoURL = "";
                            let lectureVideoDuration = 0;
        
                            const lectureDraft = await CourseDraft.findOne({
                                where: {
                                    id_chapter: newChapter.id,
                                    order: j + 1
                                }
                            });
        
                            if (lectureDraft) {
                                lectureVideoURL = lectureDraft.url;
                                lectureVideoDuration = lectureDraft.duration;
                            }
                            
                            await Lecture.create({
                                id_chapter: newChapter.id,
                                video: lectureVideoURL,
                                name: chapters[i].lectures[j].name,
                                description: chapters[i].lectures[j].description,
                                order: j + 1,
                                status: chapters[i].lectures[j].status,
                                duration: lectureVideoDuration
                            }, {
                                transaction: t
                            });
                        }
                    }
                }
            }

            t.commit();

            res.status(201).json(newCourse);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            const thumbnailDraft = CourseDraft.findOne({
                where: { 
                    id_course: courseBody.id,
                    type: "thumbnail"
                }
            });

            const coverDraft = CourseDraft.findOne({
                where: {
                    id_course: courseBody.id,
                    type: "cover"
                }
            });

            const thumbnailRef = ref(thumbnailDraft.url);
            const coverRef = ref(coverDraft.url);
            await deleteObject(thumbnailRef);
            await deleteObject(coverRef);

            await thumbnailDraft.destroy();
            await coverDraft.destroy();

            const lecturesDraft = await CourseDraft.findAll({
                where: { id_course: courseBody.id }
            });

            const deletePromises = lecturesDraft.map(async (lectureDraft: any) => {
                const videoRef = ref(lectureDraft.url);
                await deleteObject(videoRef);
            })

            Promise.all(deletePromises);

            t.rollback();
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
                // first part is index of chapter in course, second part is index of lecture in chapter
                const firstHyphen = video.originalname.indexOf('-');
                const chapterIdx = video.originalname.substring(0, firstHyphen);

                const secondHyphen = video.originalname.indexOf('-', firstHyphen + 1);
                const lectureIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);

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
                    lectureIdx: parseInt(lectureIdx),
                    duration: Math.floor(duration)
                });
                // io.to(clientsConnected[req.teacher.data.id]).emit("file uploaded", {
                //     fileName: originalFileName,
                //     url
                // });
            });
            
            await Promise.all(uploadPromises);

            req.lectureURL = urls;
            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [PUT] /courses/:courseId
    updateCourse = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            let body = req.body.data;

            body = JSON.parse(body);
            
            let { chapters, categories, ...courseBody } = body;

            const courseId = req.params.courseId;

            const course = await Course.findByPk(courseId);

            if (courseBody !== undefined) {
                await course.update({ ...courseBody }, { transaction: t });
            }

            if (categories !== undefined) {
                const categoriesList: any[] = [];
                for (const category of categories) {
                    const categoryRecord = await Category.findByPk(category);
                    if (!categoryRecord) throw new Error("Category does not exist");
                    categoriesList.push(categoryRecord);
                }
                await course.setCategories(categoriesList, { transaction: t });
            }

            if (chapters !== undefined) {
                for (const chapter of chapters) {
                    const { lectures, ...chapterBody } = chapter;
                    const chapterToUpdate = await Chapter.findByPk(chapterBody.id);

                    if (!chapterToUpdate) throw new Error("Chapter does not exist");

                    await chapterToUpdate.update(chapterBody, { transaction: t });

                    if (lectures !== undefined) {
                        for (const lecture of lectures) {
                            const lectureToUpdate = await Lecture.findByPk(lecture.id);

                            if (!lectureToUpdate) throw new Error("Lecture does not exist");

                            await lectureToUpdate.update(lecture, { transaction: t });

                            if (req.lectureURL !== undefined) {
                                const obj = req.lectureURL.find(o => o.chapterIdx === chapter.order && o.lectureIdx === lecture.order);

                                await lectureToUpdate.update({
                                    video: obj?.url,
                                    duration: obj?.duration
                                }, { transaction: t })
                            }
                        }
                    }
                }
            }

            t.commit();
            res.status(200).json(course);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
            t.rollback();

            if (req.lectureURL !== undefined && req.lectureURL.length > 0) {
                const deletePromises = req.lectureURL.map(async (lecture) => {
                    const videoRef = ref(lecture.url);
                    await deleteObject(videoRef);
                });
                await Promise.all(deletePromises);
            }

            if (req.URL !== undefined) {
                const thumbnailRef = ref(req.URL.thumbnail);
                const coverRef = ref(req.URL.cover);

                await deleteObject(thumbnailRef);
                await deleteObject(coverRef);
            }
        }
    }

    // [DELETE] /courses/:id
    deleteCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            await Course.destroy({
                where: { id: req.params.courseId }
            });

            res.status(200).json({
                id: req.params.courseId,
                message: "Course has been deleted"
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
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
                const lectureIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);
    
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
                    lectureIdx: parseInt(lectureIdx),
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
