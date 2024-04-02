const examRouter = require('./exam');
const imageRouter = require('./image');
const assignmentRouter = require('./assignment');
const knowledgeRouter = require('./knowledge');
const errorRouter = require('./error');
const reportRouter = require('./report');
const informationRouter = require('./information');

function route(app: any) {
    app.use('/api/v1/exams', examRouter);
    app.use('/api/v1/images', imageRouter);
    app.use('/api/v1/assignments', assignmentRouter);
    app.use('/api/v1/knowledges', knowledgeRouter);
    app.use('/api/v1/errors', errorRouter);
    app.use('/api/v1/reports', reportRouter);
    app.use('/api/v1/informations', informationRouter);
}

module.exports = route;