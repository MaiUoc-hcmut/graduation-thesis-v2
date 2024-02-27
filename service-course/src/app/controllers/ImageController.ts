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

class ImageController {

    // [POST] /images
    uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

            let resUrl = ""

            if (file) {
                const dateTime = fileUpload.giveCurrentDateTime();

                let body = req.body.data;

                body = JSON.parse(body);

                const { id_course, type } = body;
    
                const storageRef = ref(
                    storage,
                    `${type}/${file?.originalname + '       ' + dateTime}`
                );
    
                // Create file metadata including the content type
                const metadata = {
                    contentType: file?.mimetype,
                };
    
                // Upload the file in the bucket storage
                const snapshot = await uploadBytesResumable(
                    storageRef,
                    file?.buffer,
                    metadata
                );
    
                // Grab the public url
                const downloadURL = await getDownloadURL(snapshot.ref);
                resUrl = downloadURL;

                await CourseDraft.create({
                    id_course,
                    url: resUrl,
                    chapter_order: 0,
                    lecture_order: 0
                });
            }

            res.status(200).json({ url: resUrl });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new ImageController();