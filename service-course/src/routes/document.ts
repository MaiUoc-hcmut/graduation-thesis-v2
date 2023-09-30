const express = require('express');
const router = express.Router();

const DocumentController = require('../app/controllers/DocumentController');
const Authorize = require('../app/middleware/teacherAuth');
const DocumentFile = require('../config/firebase/file');

router.route('/')
    .get(DocumentController.getAllDocuments)
    .post(Authorize.protectedAPI, DocumentController.createDocument);
router.route('/upload-file')
    .post(Authorize.protectedAPI, DocumentFile.upload, DocumentController.uploadFile);
router.route('/:documentId')
    .get(DocumentController.getDocumentById)
    .put(Authorize.protectedAPI, DocumentController.updateDocument)
    .delete(Authorize.protectedAPI, DocumentController.deleteDocument);
router.route('/:teacherId')
    .get(Authorize.protectedAPI, DocumentController.getDocumentCreatedByTeacher);
router.route('/:courseId')
    .get(DocumentController.getDocumentBelongToCourse);
router.route('/chapterId')
    .get(DocumentController.getDocumentBelongToChapter);
router.route('/lectureId')
    .get(DocumentController.getDocumentBelongToLecture);

module.exports = router;