const express = require('express');
const router = express.Router();

const PaymentController = require('../app/controllers/PaymentController');

router.route('/')
    .get(PaymentController.testPaymentByScanQRCode);

router.route('/manual')
    .get(PaymentController.testPaymentManual);

module.exports = router;

export {}