const examRouter = require('./exam');
const imageRouter = require('./image');
const assignmentRouter = require('./assignment');
const knowledgeRouter = require('./knowledge');

function route(app: any) {
    app.use('/api/v1/exams', examRouter);
    app.use('/api/v1/images', imageRouter);
    app.use('/api/v1/assignments', assignmentRouter);
    app.use('/api/v1/knowledges', knowledgeRouter);
}

module.exports = route;