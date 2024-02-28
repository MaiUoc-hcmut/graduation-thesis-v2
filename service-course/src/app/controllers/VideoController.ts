const CourseDraft = require('../../db/models/course_draft');
const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Lecture = require('../../db/models/lecture');
import { Request, Response, NextFunction } from 'express';

const { getVideoDurationInSeconds } = require('get-video-duration');

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

class VideoController {

    // [POST] /videos
    uploadSingleLectureVideo = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const video = req.file;

            if (!video) {
                return res.status(400).json({
                    message: "Can not find video!"
                })
            }

            if (!video.mimetype.startsWith('video/')) {
                return res.status(400).json({
                    message: "Invalid mimetype for video lecture!"
                })
            }
            const dateTime = fileUpload.giveCurrentDateTime();

            let body = req.body;

            if (typeof(body) == 'string') {
                body = JSON.parse(body);
            }

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

            // Check if course has been created
            const course = await Course.findByPk(body.id_course);

            // If course is not created yet, create a draft of lecture
            if (!course) {
                await CourseDraft.create({
                    id_course: body.id_course,
                    url,
                    duration,
                    chapter_order: chapterIdx,
                    lecture_order: lectureIdx,
                    type: "video"
                });

                return res.status(201).json({
                    message: "Video has been uploaded to cloud!"
                });
            }

            // If course has been created, then update
            const chapter = await Chapter.findOne({
                where: { 
                    id_course: body.id_course,
                    order: chapterIdx
                }
            });

            const lecture = await Lecture.findOne({
                where: { 
                    id_chapter: chapter.id,
                    order: lectureIdx
                }
            });

            await lecture.update({
                duration,
                video: url
            });

            res.status(200).json({
                message: "Video has been uploaded to cloud and course has been updated!"
            });
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new VideoController();