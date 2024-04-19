const express = require('express');
const router = express.Router();

const CartController = require('../app/controllers/CartController');
const Authorize = require('../app/middleware/authorize');
const CheckingCart = require('../app/middleware/cart');

router.route('/')
    .post(CartController.createCart);

router.route('/:cartId')
    .get(Authorize.verifyUser, CheckingCart.checkGetCartOfStudent, CartController.getCartOfStudent)
    .post(Authorize.verifyStudent, CheckingCart.checkAddCourseToCart, CartController.addCourseToCart)
    .delete(Authorize.verifyStudent, CheckingCart.checkDeleteCourseFromCart, CartController.deleteCourseFromCart);

router.route('/student/:studentId')
    .get(Authorize.verifyUser,CheckingCart.checkGetCartOfStudentByStudentId , CartController.getCartOfStudentByStudentId);

router.route('/student/:studentId')
    .get(CartController.getCartInfor);

module.exports = router;