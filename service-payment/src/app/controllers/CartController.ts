const Cart = require('../../db/model/cart');
const CartCourse = require('../../db/model/cart-course');

const axios = require('axios');
const { sequelize } = require('../../config/db/index');

import { Request, Response, NextFunction } from "express";


class CartController {

    // [POST] /cart
    createCart = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_user = req.body.id_user;

            const cart = await Cart.create({
                id_user
            });

            res.status(201).json(cart);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [GET] /cart/:cartId
    getCartOfStudent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_cart = req.params.cartId;

            const records = await CartCourse.findAll({
                where: { id_cart },
                order: [['createdAt', 'ASC']]
            });

            let courseList = [];

            for (const record of records) {
                const id_course = record.id_course;

                const course = await axios.get(`${process.env.BASE_URL_COURSE_LOCAL}/courses/${id_course}`);
                courseList.push(course.data);
            }

            res.status(200).json(courseList);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [GET] /cart/student/:studentId
    getCartInfor = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const cart = await Cart.findOne({
                where: { id_user: req.params.studentId }
            });

            res.status(200).json(cart);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [POST] /cart/:cartId
    addCourseToCart = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_cart = req.params.cartId;
            const { id_course } = req.body.data;

            const newRecord = await CartCourse.create({
                id_cart,
                id_course
            }, {
                transaction: t
            });

            await t.commit();

            res.status(201).json(newRecord);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });

            await t.rollback();
        }
    }

    // [DELETE] /cart/:cartId
    deleteCourseFromCart = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_cart = req.params.cartId;
            const { id_course } = req.body.data;

            await CartCourse.destroy({
                where: {
                    id_cart,
                    id_course
                },
            }, {
                transaction: t
            });

            res.status(200).json({
                message: "Course has been deleted from cart",
                course: id_course
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });

            await t.rollback();
        }
    }
}


module.exports = new CartController();