const Chapter = require('../../db/models/chapter');
const Lecture = require('../../db/models/lecture');
const Course = require('../../db/models/course');

const { getVideoDurationInSeconds } = require('get-video-duration')

const io = require('../../index');
const clientsConnected = require('../../socket');

const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig } = require('../../config/firebase/firebase');

const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);
const storage = getStorage();

import { Request, Response, NextFunction } from "express";

class ChapterController {
    // [GET] /chapters
    getAllChapter = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const chapters = await Chapter.findAll();

            res.status(200).json(chapters);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /chapters/:chapterId
    getChapterById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const chapter = await Chapter.findByPk(req.params.chapterId);

            if (!chapter) return res.status(404).json({ message: "Chapter does not exist" });

            res.status(200).json(chapter);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /chapters/course/:courseId
    getChapterBelongToCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const courseId = req.params.courseId;
            const chapters = await Chapter.findAll({
                where: { id_course: courseId }
            });

            res.status(200).json(chapters);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /chapters/:id/all
    getChapterFull(req: Request, res: Response, next: NextFunction) {
        Chapter.findAll({ where: { id_course: req.params.id_course }, include: ["lectures"] }).then((chapter: any) =>
            res.send(chapter))
            .catch(next);
    }

    // [POST] /chapters/create
    createChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { lectures, ...body } = req.body;

            const newChapter = await Chapter.create(body);

            if (lectures !== undefined) {

                const lectureURL = req.lectureURL;

                for (let i = 0; i < lectures.length; i++) {
                    const obj = lectureURL.find(o => o.lectureIdx === i + 1);
                    let lectureVideoURL = "";
                    let lectureVideoDuration = 0;
                    if (obj) {
                        lectureVideoURL = obj.url;
                        lectureVideoDuration = obj.duration;
                    }
                    const newLecture = await Lecture.create({
                        id_chapter: newChapter.id,
                        name: lectures[i].name,
                        description: lectures[i].description,
                        order: i + 1,
                        status: lectures[i].status,
                        video: lectureVideoURL,
                        duration: lectureVideoDuration
                    });
                }
            }

            res.status(201).json(newChapter);
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
                io.to(clientsConnected[req.teacher.data.id]).emit("file uploaded", {
                    fileName: originalFileName,
                    url
                })
            });
            
            await Promise.all(uploadPromises);

            req.lectureURL = urls;
            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /chapters/:id
    updateChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const chapterId = req.params.chapterId;
            const chapter = await Chapter.update(req.body, {
                where: { id: chapterId }
            });

            res.status(200).json(chapter);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /chapters/:chapterId
    deleteChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            await Chapter.destroy({
                where: { id: req.params.chapterId }
            })

            res.status(200).json({
                id: req.params.chapter,
                message: "Chapter has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new ChapterController();
