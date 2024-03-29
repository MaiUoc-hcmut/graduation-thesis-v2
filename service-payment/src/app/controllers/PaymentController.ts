import { Request, Response, NextFunction } from "express";

class PaymentController {
    testPaymentByScanQRCode = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            let response = "";

            //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
            //parameters
            var partnerCode = "MOMO";
            var accessKey = "F8BBA842ECF85";
            var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            var requestId = partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = "pay with MoMo";
            var redirectUrl = "https://www.facebook.com/";
            var ipnUrl = "http://localhost:4004/api/v1/payment/receive-ipn";
            // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
            var amount = "1000000";
            var requestType = "captureWallet"
            var extraData = ""; //pass empty value if your merchant does not have stores

            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            var rawSignature = 
                "accessKey="+ accessKey+
                "&amount=" + amount+
                "&extraData=" + extraData+
                "&ipnUrl=" + ipnUrl+
                "&orderId=" + orderId+
                "&orderInfo=" + orderInfo+
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl+
                "&requestId=" + requestId+
                "&requestType=" + requestType
            //puts raw signature
            console.log("--------------------RAW SIGNATURE----------------")
            console.log(rawSignature)
            //signature
            const crypto = require('crypto');
            var signature = crypto.createHmac('sha256', secretkey)
                .update(rawSignature)
                .digest('hex');
            console.log("--------------------SIGNATURE----------------")
            console.log(signature)

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                accessKey : accessKey,
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                extraData : extraData,
                requestType : requestType,
                signature : signature,
                lang: 'en'
            });
            //Create the HTTPS objects
            const https = require('https');
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            //Send the request and get the response
            const reqq = https.request(options, (ress: any) => {
                console.log(`Status: ${ress.statusCode}`);
                console.log(`Headers: ${JSON.stringify(ress.headers)}`);
                ress.setEncoding('utf8');
                ress.on('data', (body: any) => {
                    console.log('Body: ');
                    console.log(body);
                    console.log('payUrl: ');
                    console.log(JSON.parse(body).payUrl);

                    response = JSON.parse(body);
                });
                ress.on('end', () => {
                    console.log('No more data in response.');
                    res.status(200).json(response);
                });
            })

            reqq.on('error', (e: any) => {
                console.log(`problem with request: ${e.message}`);
            });
            // write data to request body
            console.log("Sending....")
            reqq.write(requestBody);
            reqq.end();

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            })
        }
    }

    testPaymentManual = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
            //parameters
            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            var orderInfo = 'pay with MoMo';
            var partnerCode = 'MOMO';
            var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
            var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
            var amount = '50000';
            var orderId = partnerCode + new Date().getTime();
            var requestId = orderId;
            var extraData ='';
            var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
            var orderGroupId ='';
            var autoCapture =true;
            var lang = 'vi';

            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&paymentCode=" + paymentCode + "&requestId=" + requestId;
            //puts raw signature
            console.log("--------------------RAW SIGNATURE----------------")
            console.log(rawSignature)
            //signature
            const crypto = require('crypto');
            var signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');
            console.log("--------------------SIGNATURE----------------")
            console.log(signature)

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                partnerName : "Test",
                storeId : "MomoTestStore",
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                lang : lang,
                autoCapture: autoCapture,
                extraData : extraData,
                paymentCode : paymentCode,
                orderGroupId: orderGroupId,
                signature : signature
            });
            //Create the HTTPS objects
            const https = require('https');
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/pos',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            //Send the request and get the response
            const req = https.request(options, (res: any) => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Headers: ${JSON.stringify(res.headers)}`);
                res.setEncoding('utf8');
                res.on('data', (body: any) => {
                    console.log('Body: ');
                    console.log(body);
                    console.log('resultCode: ');
                    console.log(JSON.parse(body).resultCode);
                });
                res.on('end', () => {
                    console.log('No more data in response.');
                });
            })

            req.on('error', (e: any) => {
                console.log(`problem with request: ${e.message}`);
            });
            // write data to request body
            console.log("Sending....")
            req.write(requestBody);
            req.end();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            })
        }
    }

    // [POST] /payment/receive-ipn 
    receiveInstantPaymentNotification = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;
            console.log(body);

            res.status(200).json(body);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }
}

module.exports = new PaymentController();