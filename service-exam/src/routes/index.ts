const examRouter = require('./exam');
const imageRouter = require('./image');

function route(app: any) {
    app.use('/api/v1/exams', examRouter);
    app.use('/api/v1/images', imageRouter);
}

module.exports = route;