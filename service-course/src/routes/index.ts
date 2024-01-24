const coursesRouter = require("./courses");
const commentsRouter = require("./comments");
const documentRouter = require('./document');
const folderRouter = require('./folders');
const chapterRouter = require('./chapters');
const lectureRouter = require('./lectures');
const categoryRouter = require('./category');
const parentCategoryRouter = require('./par-category');
const testRouter = require('./test');

function route(app: any) {
    app.use("/api/v1/courses", coursesRouter);
    app.use("/api/v1/chapters", chapterRouter);
    app.use("/api/v1/lectures", lectureRouter);
    app.use("/api/v1/lecture/comment", commentsRouter);
    app.use('/api/v1/document', documentRouter);
    app.use('/api/v1/folder', folderRouter);
    app.use('/api/v1/categories', categoryRouter);
    app.use('/api/v1/par-categories', parentCategoryRouter);
    app.use('/api/v1/test', testRouter);
}

module.exports = route;
