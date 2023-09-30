const coursesRouter = require("./courses");
const documentRouter = require('./document');

function route(app: any) {
    app.use("/api/v1/courses", coursesRouter);
    app.use('/api/v1/document', documentRouter);
}

module.exports = route;
