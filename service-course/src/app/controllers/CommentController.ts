import { Request, Response, NextFunction } from 'express';
const Comment = require('../../db/models/comment');

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

class CommentController {
    // [GET] /comments/:id
    getComment(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        Comment.findByPk(id)
            .then((comment: any) => res.send(comment))
            .catch(next);
    }

    // [GET] /comments
    getAllComment(req: Request, res: Response, next: NextFunction) {
        const id_lecture = req.query.id_lecture
        console.log(id_lecture);

        Comment.findAll({
            where: {
                id_lecture: id_lecture
            }
        })
            .then((comment: any) => res.send(comment))
            .catch(next);
    }


    // [POST] /comments/create
    async create(req: Request, res: Response, next: NextFunction) {
        let data = req.body;
        const file = req.file
        if (file) {
            const dateTime = fileUpload.giveCurrentDateTime();

            const storageRef = ref(
                storage,
                `comments/${file?.originalname + '       ' + dateTime}`
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

            data = { ...data, iamge: downloadURL };

        }

        const comment = Comment.build(data);
        comment
            .save()
            .then(() => res.send(comment))
            .catch(next);
    }

    // [PUT] /comments/:id
    update(req: Request, res: Response, next: NextFunction) {
        Comment.update(req.body.data, {
            where: {
                id: req.params.id,
            },
        })
            .then((comment: any) => res.send(comment))
            .catch(next);
    }

    // [DELETE] /comments/:id
    delete(req: Request, res: Response, next: NextFunction) {
        Comment.destroy({
            where: {
                id: req.params.id,
            },
        })
            .then(res.send({}))
            .catch(next);
    }

}

module.exports = new CommentController();
