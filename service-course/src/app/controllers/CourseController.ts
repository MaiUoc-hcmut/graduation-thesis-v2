const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Lecture = require('../../db/models/lecture');
import { Request, Response, NextFunction } from 'express';
const { getVideoDurationInSeconds } = require('get-video-duration')

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
    // namespace Express.Multer {
    //     interface File {
    //         thumbnail: Express.Multer.File;
    //         cover: Express.Multer.File;
    //     }
    // }

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
}

class CourseController {

    // Get all courses
    // [GET] /courses
    getAllCourse = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const courses = Course.findAll();

            res.status(200).json(courses)
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /courses/all
    getAllCourseFull(req: Request, res: Response, next: NextFunction) {
        Course.findByPk(req.params.id, { include: ['chapters'] })
            .then((course: any) => res.send(course))
            .catch(next);
    }

    // Get course by Id
    // [GET] /courses/:id
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
            const id_teacher = req.teacher.data.id;
            const { chapters, ...courseBody } = req.body;

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

            const newChapters = [];
            for (let i = 0; i < chapters.length; i++) {
                const newChapter = await Chapter.create({
                    name: chapters[i].name,
                    description: chapters[i].description,
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

    uploadThumbnailAndCover = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            
            const dateTime = fileUpload.giveCurrentDateTime();

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
            res.status(500).json({ error: error.message });
        }
    }

    uploadLectureVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const urls: ResponseVideoFile[] = [];

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
                const duration = await Math.floor(getVideoDurationInSeconds(url));

                urls.push({
                    name: originalFileName,
                    url,
                    chapterIdx: parseInt(chapterIdx),
                    lectureIdx: parseInt(lectureIdx),
                    duration
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
    delete(req: Request, res: Response, next: NextFunction) {
        Course.destroy({
            where: { id: req.params.id }
        })
            .then(res.send({}))
            .catch(next);
    }

    test = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const urls: ResponseVideoFile[] = [];

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
                const duration = await Math.floor(getVideoDurationInSeconds(url));
                console.log(duration, url);
                urls.push({
                    name: originalFileName,
                    url,
                    chapterIdx: parseInt(chapterIdx),
                    lectureIdx: parseInt(lectureIdx),
                    duration
                });
            });

            
            await Promise.all(uploadPromises);

            req.lectureURL = urls;
            res.send(urls);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new CourseController();
