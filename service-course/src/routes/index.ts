const coursesRouter = require("./courses");
const commentsRouter = require("./comments");
const documentRouter = require('./document');
const folderRouter = require('./folders');

function route(app: any) {
    app.use("/api/v1/courses", coursesRouter);
    app.use("/api/v1/lecture/comment", commentsRouter);
    app.use('/api/v1/document', documentRouter);
    app.use('/api/v1/folder', folderRouter);
}

module.exports = route;
