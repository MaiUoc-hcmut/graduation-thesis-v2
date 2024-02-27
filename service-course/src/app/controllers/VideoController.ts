const CourseDraft = require('../../db/models/course_draft');
import { Request, Response, NextFunction } from 'express';

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
            const file = req.file;

            let resUrl = "";

            if (file) {
                const dateTime = fileUpload.giveCurrentDateTime();

                let body = req.body.data;

                body = JSON.parse(body);
            }
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new VideoController();