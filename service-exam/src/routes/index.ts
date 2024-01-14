const examController = require("../app/controllers/examController");

function route(app: any) {
    app.get("/api/v1/exam/studentGetExam", examController.studentGetExam);
    app.post("/api/v1/exam/studentSubmitExam", examController.studentSubmitExam);
}

module.exports = route;