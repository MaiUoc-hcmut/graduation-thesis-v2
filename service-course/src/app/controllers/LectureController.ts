const Lecture = require('../../db/models/lecture')
const Chapter = require('../../db/models/chapter')
import { Request, Response, NextFunction } from "express";
const { getVideoDurationInSeconds } = require('get-video-duration');

const progress = require('progress-stream');

const io = require('../../index');
const clientsConnected = require('../../socket');

const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig, storage } = require('../../config/firebase/firebase');
const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);
// const storage = getStorage();

class LectureController {

    // [GET] /lectures
    getAllLectures = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const lectures = await Lecture.findAll();

            res.status(200).json(lectures);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /lectures/:lectureId
    getLectureById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.params.lectureId;

            const lecture = await Lecture.findByPk(id);

            res.status(200).json(lecture);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /lectures/chapter/:chapterId
    getLectureBelongToChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const chapterId = req.params.chapterId;

            const lectures = await Lecture.findAll({
                where: { id_chapter: chapterId }
            });

            res.status(200).json(lectures);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /lectures
    createLecture = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;

            const lectureURL = req.lectureURL[0];

            const newLecture = await Lecture.create({
                video: lectureURL.url,
                duration: lectureURL.duration,
                ...body
            });

            res.status(201).json(newLecture);
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

    // [PUT] /lectures/:lectureId
    updateLecture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            const lecture = await Lecture.update(body, {
                where: { id: req.params.lectureId }
            });

            res.status(200).json(lecture);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /lectures/:lectureId
    deleteLecture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Lecture.destroy({
                where: { id: req.params.lectureId }
            });

            res.status(200).json({
                id: req.params.lectureId,
                message: "Lecture has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    test = async (req: Request, res: Response) => {
        try {
            const file: any = req.file;
            const progressStream = progress({
                length: file.size,
                time: 100 /* ms */
            });

            progressStream.on('progress', (progress: any) => {
                console.log(`Upload progress: ${progress.percentage}%`);
            });

            const bucket = storage.bucket('video course');
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err: any) => {
                console.error(err);
                res.status(500).end();
            });

            blobStream.on('finish', () => {
                console.log('Upload completed');
                res.status(200).end();
            });

            progressStream.pipe(blobStream);

            res.status(200).json({
                message: "Success"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new LectureController();
