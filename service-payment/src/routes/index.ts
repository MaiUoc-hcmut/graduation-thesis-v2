const testRouter = require('./test');

function route(app: any) {
    app.use('/api/v1/test', testRouter);
}

module.exports = route;