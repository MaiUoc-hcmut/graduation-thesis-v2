import { Request, Response, NextFunction } from "express";
const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig } = require('../../config/firebase/firebase');

const progress = require('progress-stream');

const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');

const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);

const storage = getStorage();

class Test {
    testUploadFile = async (req: Request, res: Response) => {
        try {
            const file = req.file
    
            const dateTime = fileUpload.giveCurrentDateTime();

            if (file) {
                const firstHyphen = file.originalname.indexOf('-');
                const chapterIdx = file.originalname.substring(0, firstHyphen);

                const secondHyphen = file.originalname.indexOf('-', firstHyphen + 1);
                const lectureIdx = file.originalname.substring(firstHyphen + 1, secondHyphen);

                const originalFileName = file.originalname.substring(secondHyphen + 1);

                const storageRef = ref(
                    storage, 
                    `video course/${originalFileName + "       " + dateTime}`
                );

                const metadata = {
                    contentType: file.mimetype,
                };

                // Tạo một tác vụ tải lên
                const uploadTask = storageRef.put(file.buffer, metadata);

                // Theo dõi tiến trình tải lên
                uploadTask.on('state_changed', 
                    (snapshot: any) => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // Gửi sự kiện 'upload-progress' cùng với tiến trình tải lên
                    }, 
                    (error: any) => {
                        console.log(error);
                    }, 
                    async () => {
                        const url = await uploadTask.snapshot.ref.getDownloadURL();
                        res.send(url);
                    }
                );
            }
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new Test();