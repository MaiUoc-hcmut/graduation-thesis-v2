const PaymentController = require('../app/controllers/PaymentController');

const express = require('express');
const router = express.Router();

router.route('/receive-ipn')
    .post(PaymentController.receiveInstantPaymentNotification);

module.exports = router;

export {}