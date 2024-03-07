const Review = require('../../db/models/review');
const Course = require('../../db/models/course');

const axios = require('axios');
require('dotenv').config();
import { Request, Response, NextFunction } from 'express';

const { sequelize } = require('../../config/db/index');

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

    // [GET] /reviews/teacher/:teacherId/page/:page
    getReviewsForTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Review.count({
                where: { id_teacher }
            });

            const reviews = await Review.findAll({
                where: { id_teacher },
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            let totalRating = 0;
            let starCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            for (const review of reviews) {
                totalRating += review.rating;
                starCount[review.rating]++;
                
                const user = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${review.id_student}`);

                review.dataValues.user = { avatar: user.data.avatar, name: user.data.name };
            }

            let starDetails: { [key: string]: { quantity: number, percentage: number } } = {};

            for (let i = 1; i <= 5; i++) {
                starDetails[`${i}star`] = {
                    quantity: starCount[i],
                    percentage: (starCount[i] / reviews.length) * 100
                };
            }

            let response = {
                count,
                reviews,
                averageRating: totalRating / reviews.length,
                starDetails
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/course/:courseId/page.:page
    getReviewsForCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_course = req.params.courseId;

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Review.count({
                where: { id_course }
            });

            const reviews = await Review.findAll({
                where: { id_course },
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            let totalRating = 0;
            let starCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            for (const review of reviews) {
                totalRating += review.rating;
                starCount[review.rating]++;

                const user = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${review.id_student}`);

                review.dataValues.user = { avatar: user.data.avatar, name: user.data.name };
            }

            let starDetails: { [key: string]: { quantity: number, percentage: number } } = {};

            for (let i = 1; i <= 5; i++) {
                starDetails[`${i}star`] = {
                    quantity: starCount[i],
                    percentage: (starCount[i] / reviews.length) * 100
                };
            }

            let response = {
                count,
                reviews,
                averageRating: totalRating / reviews.length,
                starDetails
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /reviews/exam/:examId/page/:page
    getReviewsForExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_exam = req.params.examId;

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Review.count({
                where: { id_exam }
            });

            const reviews = await Review.findAll({
                where: { id_exam },
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            let totalRating = 0;
            let starCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            for (const review of reviews) {
                totalRating += review.rating;
                starCount[review.rating]++;
                
                const user = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${review.id_student}`);

                review.dataValues.user = { avatar: user.data.avatar, name: user.data.name };
            }

            let starDetails: { [key: string]: { quantity: number, percentage: number } } = {};

            for (let i = 1; i <= 5; i++) {
                starDetails[`${i}star`] = {
                    quantity: starCount[i],
                    percentage: (starCount[i] / reviews.length) * 100
                };
            }

            let response = {
                count,
                reviews,
                averageRating: totalRating / reviews.length,
                starDetails
            }

            res.status(200).json(response);
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

    // [GET] /reviews/student/:studentId/page/:page
    getReviewsBelongToStudent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Review.count({
                where: { id_student }
            });

            const reviews = await Review.findAll({
                where: { id_student },
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            let totalRating = 0;

            for (const review of reviews) {
                totalRating += review.rating;
            }

            let response = {
                reviews,
                averageRating: totalRating / reviews.length
            }

            res.status(200).json(response);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /reviews
    createReview = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_student = req.student.data.id;
            const { object, ...body } = req.body.data;

            const newReview = await Review.create({
                id_student,
                ...body
            }, {
                transaction: t
            });

            if (object === "course") {
                const course = await Course.findByPk(body.id_course);

                const total_review = course.total_review + 1;
                const average_rating = ((course.average_rating * course.total_review) + body.rating) / total_review;

                await course.update({
                    total_review,
                    average_rating,
                }, {
                    transaction: t
                });
            } else if (object === "teacher") {
                
            }

            await t.commit();

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