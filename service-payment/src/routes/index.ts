const testRouter = require('./test');
const paymentRouter = require('./payment');

function route(app: any) {
    app.use('/api/v1/test', testRouter);
    app.use('/api/v1/payment', paymentRouter);
}

module.exports = route;