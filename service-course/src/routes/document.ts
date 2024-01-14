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

router.route('/upload-multi-file')
    .post(Authorize.protectedAPI, DocumentFile.uploadMulti, DocumentController.uploadMultiFile);

router.route('/:documentId')
    .get(DocumentController.getDocumentById)
    .put(Authorize.protectedAPI, DocumentController.updateDocument)
    .delete(Authorize.protectedAPI, DocumentController.deleteDocument);

router.route('/teacher/:teacherId')
    .get(Authorize.protectedAPI, DocumentController.getDocumentCreatedByTeacher);

router.route('/course/:courseId')
    .get(DocumentController.getDocumentBelongToCourse);

router.route('/chapter/:chapterId')
    .get(DocumentController.getDocumentBelongToChapter);

router.route('/lecture/:lectureId')
    .get(DocumentController.getDocumentBelongToLecture);
    
router.route('/folder/:parentId')
    .get(Authorize.protectedAPI, DocumentController.getDocumentBelongToFolder);

module.exports = router;