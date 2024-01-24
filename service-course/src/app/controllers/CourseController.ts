const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Lecture = require('../../db/models/lecture');
const Category = require('../../db/models/category');

import { Request, Response, NextFunction } from 'express';

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
            const courses = await Course.findAll();

            res.status(200).json(courses)
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /course/full/:courseId
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
                        attributes: ['name'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            if (!course) return res.status(404).json({ message: "Course does not exist" });

            res.status(200).json(course);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    getCourseFilterByCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { categories } = req.body;

            const course = await Course.findAll({
                include: [
                    {
                        model: Category,
                        where: {
                            id: categories
                        },
                        attributes: ['name'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // Get all courses that created by a teacher
    // [GET] /course/teacher/:teacherId
    getCourseCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const courses = Course.findAll({
                where: { id_teacher }
            });

            res.status(200).json(courses)
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /courses
    createCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = "123e4567-e89b-12d3-a456-426614174000"  // req.teacher.data.id;
            
            let { chapters, categories, ...courseBody } = req.body;
            
            chapters = JSON.parse(chapters);
            categories = JSON.parse(categories);
            
            // Thumbnail and cover image url after upload
            const { thumbnail, cover } = req.URL as { thumbnail: string, cover: string };

            // Lecture video url and its chapter index in course, lecture index in chapter.
            const lectureURL = req.lectureURL;

            const newCourse = await Course.create({
                thumbnail,
                cover_image: cover,
                ...courseBody,
                id_teacher
            });

            const categoriesInstances = [];

            for (let i = 0; i < categories.length; i++) {
                const category = await Category.findByPk(categories[i]);
                categoriesInstances.push(category);
            }

            newCourse.addCategories(categoriesInstances);

            const newChapters = [];
            for (let i = 0; i < chapters.length; i++) {
                const newChapter = await Chapter.create({
                    name: chapters[i].name,
                    id_course: newCourse.id,
                    status: chapters[i].status,
                    order: i + 1
                });

                newChapters.push(newChapter);

                for (let j = 0; j < chapters[i].lectures.length; j++) {
                    const obj = lectureURL.find(o => o.chapterIdx === i + 1 && o.lectureIdx === j + 1);
                    let lectureVideoURL = "";
                    let lectureVideoDuration = 0;
                    if (obj) {
                        lectureVideoURL = obj.url;
                        lectureVideoDuration = obj.duration;
                    }
                    const newLecture = await Lecture.create({
                        id_chapter: newChapter.id,
                        video: lectureVideoURL,
                        name: chapters[i].lectures[j].name,
                        description: chapters[i].lectures[j].description,
                        order: j + 1,
                        status: chapters[i].lectures[j].status,
                        duration: lectureVideoDuration
                    });
                }
            }

            res.status(201).json(newCourse);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    uploadThumbnailAndCover = async (req: RequestForCourse, res: Response, next: NextFunction) => {
        try {
            const files = req.files // as { [fieldname: string]: Express.Multer.File[] };
            
            const dateTime = fileUpload.giveCurrentDateTime();

            const thumbnailRef = ref(
                storage,
                `thumbnails course/${files[0].originalname + '       ' + dateTime}`
            );
            const coverRef = ref(
                storage,
                `cover image course/${files[1].originalname + '       ' + dateTime}`
            );

            // Create file metadata including the content type
            const metadataThumbnail = {
                contentType: files[0].mimetype,
            };
            const metadataCover = {
                contentType: files[1].mimetype,
            };

            // Upload the file in the bucket storage
            const thumbnailSnapshot = await uploadBytesResumable(
                thumbnailRef,
                files[0].buffer,
                metadataThumbnail
            );

            const coverSnapshot = await uploadBytesResumable(
                coverRef,
                files[1].buffer,
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
            res.status(500).json({ error: error.message });
        }
    }

    uploadLectureVideo = async (req: RequestForCourse, res: Response, next: NextFunction) => {
        try {
            const files = req.files // as { [fieldname: string]: Express.Multer.File[] };

            const urls: ResponseVideoFile[] = [];

            const uploadPromises = files.slice(2).map(async (video) => {
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
                const duration = await Math.floor(getVideoDurationInSeconds(url));

                urls.push({
                    name: originalFileName,
                    url,
                    chapterIdx: parseInt(chapterIdx),
                    lectureIdx: parseInt(lectureIdx),
                    duration
                });
                io.to(clientsConnected[req.teacher.data.id]).emit("file uploaded", {
                    fileName: originalFileName,
                    url
                });
            });
            
            await Promise.all(uploadPromises);

            req.lectureURL = urls;
            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /courses/:id
    update(req: Request, res: Response, next: NextFunction) {
        Course.update(req.body.data, {
            where: { id: req.params.id },
        })
            .then((course: any) => res.send(course))
            .catch(next);
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
            res.status(500).json({ error: error.message });
        }
    }

    // test = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    //         const urls: ResponseVideoFile[] = [];
    
    //         const uploadPromises = files.video.map(async (video) => {
    //             const dateTime = fileUpload.giveCurrentDateTime();
    
    //             const firstHyphen = video.originalname.indexOf('-');
    //             const chapterIdx = video.originalname.substring(0, firstHyphen);
    
    //             const secondHyphen = video.originalname.indexOf('-', firstHyphen + 1);
    //             const lectureIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);
    
    //             const originalFileName = video.originalname.substring(secondHyphen + 1);
    
    //             const storageRef = ref(
    //                 storage, 
    //                 `video course/${originalFileName + "       " + dateTime}`
    //             );
    
    //             const metadata = {
    //                 contentType: video.mimetype,
    //             };
    
    //             // Tạo một tác vụ tải lên
    //             const uploadTask = storageRef.put(video.buffer, metadata);
    
    //             // Theo dõi tiến trình tải lên
    //             uploadTask.on('state_changed', 
    //                 (snapshot: any) => {
    //                     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                     console.log('Upload is ' + progress + '% done');
    //                     // Gửi sự kiện 'upload-progress' cùng với tiến trình tải lên
    //                     io.emit('upload-progress', { fileName: originalFileName, progress });
    //                 }, 
    //                 (error: any) => {
    //                     console.log(error);
    //                 }, 
    //                 async () => {
    //                     const url = await uploadTask.snapshot.ref.getDownloadURL();
    //                     const duration = await Math.floor(getVideoDurationInSeconds(url));
    
    //                     urls.push({
    //                         name: originalFileName,
    //                         url,
    //                         chapterIdx: parseInt(chapterIdx),
    //                         lectureIdx: parseInt(lectureIdx),
    //                         duration
    //                     });
    //                     // Gửi sự kiện 'upload-complete' cùng với thông tin video
    //                     io.emit('upload-complete', { fileName: originalFileName, url });
    //                 }
    //             );
    //         });
            
    //         await Promise.all(uploadPromises);
    
    //         req.lectureURL = urls;
    //         next();
    //     } catch (error: any) {
    //         console.log(error.message);
    //         res.status(500).json({ error: error.message });
    //     }
    // }

}

module.exports = new CourseController();
