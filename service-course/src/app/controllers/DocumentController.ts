const Document = require('../../db/models/document');
const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Lecture = require('../../db/models/lecture');

const { ref, getDownloadURL, uploadBytes, getStorage } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../../config/firebase/firebase');
const DocumentFile = require('../../config/firebase/file');

import { Request, Response, NextFunction } from "express";
const dotenv = require('dotenv').config();

declare global {
    namespace Express {
      interface Request {
        teacher?: any;
      }
    }
}

interface RequestWithFile extends Request {
    file: any; // or the actual type of your file
}

initializeApp(firebaseConfig);

class DocumentController {
    // [GET] /api/v1/document
    getAllDocuments = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const documents = await Document.findAll();
            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/document/:documentId
    getDocumentById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const docId = req.params.documentId;
            const document = await Document.findByPk(docId);
            if (!document) return res.status(404).json({ message: "Document not found!" });

            res.status(200).json(document);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/document/:teacherId
    getDocumentCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const teacherId = req.params.teacherId;
            const teacherAuthId = req.teacher.dataValues.id
            if (teacherId !== teacherAuthId) 
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            const documents = await Document.findAll({
                where: { id_teacher: teacherId }
            })

            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/document/:courseId
    getDocumentBelongToCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            // const courseId = req.params.courseId;
            // const course = await Course.findByPk(courseId);
            // if (!course) return res.status(404).send("Course not found!");

            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/document/:chapterId
    getDocumentBelongToChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /api/v1/document/:lectureId
    getDocumentBelongToLecture = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /api/v1/document
    createDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.teacher.data.id;
            const body = req.body;
            body.id_teacher = id_teacher;
            const categories = [...body.categories];
            delete body.categories;

            const newDocument = Document.create({ ...body });

            await newDocument.addCategories(categories);

            res.status(200).json(newDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    uploadFile = async (req: RequestWithFile, res: Response, _next: NextFunction) => {
        try {
            const storage = getStorage();

            const dateTime = DocumentFile.giveCurrentDateTime();

            const storageRef = ref(storage, `document/${req.file.originalname + "       " + dateTime}`)

            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
            const url = await getDownloadURL(snapshot.ref);

            res.status(200).send(url);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /api/v1/document/:documentId
    updateDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { teacherId, ...body } = req.body;
            if (teacherId !== req.teacher.dataValues.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            const documentId = req.params.documentId;

            const updatedDocument = Document.findByPk(documentId);
            updatedDocument.update(body);
            
            res.status(200).json(updatedDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /api/v1/document/:documentId
    deleteDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { teacherId } = req.body;
            if (teacherId !== req.teacher.dataValues.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            const documentId = req.params.documentId;

            const document = await Document.findByPk(documentId);
            if (!document) return res.status(404).json({ message: "Document does not exist!"});

            await document.destroy();

            res.status(200).json({ message: "Document has been deleted"});
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /api/v1/document
    deleteMultiDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { teacherId } = req.body;
            if (teacherId !== req.teacher.dataValues.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            const documentIds = req.body.documentIds;
            const existingId = await Document.findAll({
                where: { id: documentIds }
            }).map((document: any) => document.id)
            await Document.destroy({ where: { id: existingId } });

            res.status(200).json({ message: "All selected document have been deleted!" });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DocumentController();