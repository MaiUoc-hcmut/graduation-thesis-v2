const Cart = require('../../db/model/cart');
const CartCourse = require('../../db/model/cart-course');

const axios = require('axios');
const createError = require('http-errors');
import { Request, Response, NextFunction } from "express";

class CheckingCart {
    checkGetCartOfStudent = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_cart = req.params.cartId;
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const cart = await Cart.findByPk(id_cart);
            if (!cart) {
                let error = "Cart does not exist!"
                return next(createError.BadRequest(error));
            }
            if (id_user !== cart.id_user && role !== "admin") {
                let error = "You do not have permission to get this information!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkAddCourseToCart = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_cart = req.params.cartId;
            const { id_course } = req.body.data;
            const id_user = req.student.data.id;

            const record = await CartCourse.findOne({
                where: {
                    id_cart,
                    id_course
                }
            });

            if (record) {
                let error = "This course already in the cart!";
                return next(createError.BadRequest(error));
            }

            const cart = await Cart.findByPk(id_cart);
            if (id_user !== cart.id_user) {
                let error = "You do not have permission to do this action";
                return next(createError.Unauthorized(error));
            }

            next();

        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkDeleteCourseFromCart = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_cart = req.params.cartId;
            const { id_course } = req.body.data;
            const id_user = req.student.data.id;

            const record = await CartCourse.findOne({
                where: {
                    id_cart,
                    id_course
                }
            });

            if (!record) {
                let error = "This course does not in cart!";
                return next(createError.BadRequest(error));
            }

            const cart = await Cart.findByPk(id_cart);
            if (id_user !== cart.id_user) {
                let error = "You do not have permission to do this action";
                return next(createError.Unauthorized(error));
            }

            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingCart();