const examsRouter = require("./exams");

function route(app: any) {
    app.use("/api/v1/exam", examsRouter);
}
module.exports = route;