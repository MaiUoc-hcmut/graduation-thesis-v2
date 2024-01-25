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

declare global {
    namespace Express {
        interface Request {
            ImageUrl: string
        }
    
    }
}

class CommentController {
    // [GET] /comments
    getAllComment = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await Comment.findAll();

            res.status(200).json(comments);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /comments/:commentId
    getCommentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await Comment.findByPk(req.params.commentId);

            if (!comment) return res.status(404).json({ message: "Comment does not exist" });

            res.status(200).json(comment);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /comments/lecture/:lectureId
    getCommentBelongToLecture = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const comments = Comment.findAll({
                where: { id_lecture: req.params.lectureId }
            });

            res.status(200).json(comments);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /comments/create
    createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            const id_user = "123e4567-e89b-12d3-a456-426614174000";

            let image = "";
            if (req.ImageUrl !== undefined) {
                image = req.ImageUrl;
            }

            const newComment = await Comment.create({
                id_user,
                image,
                ...data
            });

            res.status(201).json(newComment);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    uploadCommentImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

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
                req.ImageUrl = downloadURL;
            }

            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
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

    // [DELETE] /comments/:commenId
    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await Comment.findByPk(req.params.commentId);

            if (!comment) return res.status(404).json({ message: "Comment does not exist" });

            await comment.destroy();

            res.status(200).json({
                id: req.params.commentId,
                message: "Comment has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new CommentController();
