const testRouter = require('./test');
const notifyRouter = require('./notification');

function route(app: any) {
    app.use('/api/v1/test', testRouter);
    app.use('/api/v1/notification', notifyRouter);
}

module.exports = route;