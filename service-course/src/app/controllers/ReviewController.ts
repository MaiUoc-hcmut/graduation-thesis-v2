const Review = require('../../db/models/review');

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

class ReviewController {

    // [GET] /reviews
    getAllReviews = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const reviews = await Review.findAll();

            res.status(200).json(reviews);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/teacher/:teacherId
    getReviewsForTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const reviews = await Review.findAll({
                where: { id_teacher: req.params.teacherId }
            });

            res.status(200).json(reviews);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/course/:courseId
    getReviewsForCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const reviews = await Review.findAll({
                where: { id_course: req.params.courseId }
            });

            res.status(200).json(reviews);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/exam/:examId
    getReviewsForExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const reviews = await Review.findAll({
                where: { id_exam: req.params.examId }
            });

            res.status(200).json(reviews);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/:reviewId
    getReviewById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const review = await Review.findByPk(req.params.reviewId);

            if (!review) return res.status(404).json({ message: "Review does not exist" });

            res.status(200).json(review);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/student/:studentId
    getReviewsBelongToStudent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const reviews = await Review.findAll({
                where: { id_student: req.params.studentId }
            });

            res.status(200).json(reviews);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /reviews
    createReview = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.student.data.id;
            const body = req.body.data;

            const newReview = await Review.create({
                id_student,
                ...body
            });

            res.status(201).json(newReview);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    uploadReviewImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

            if (file) {
                const dateTime = fileUpload.giveCurrentDateTime();
    
                const storageRef = ref(
                    storage,
                    `reviews/${file?.originalname + '       ' + dateTime}`
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
            res.status(500).json({ error });
        }
    }

    // [DELETE] /reviews/:reviewId
    deleteReview = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const review = await Review.findByPk(req.params.reviewId);

            if (!review) return res.status(404).json({ message: "Review does not exist" });

            await review.destroy();

            res.status(200).json({
                id: req.params.reviewId,
                message: "Review has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new ReviewController();