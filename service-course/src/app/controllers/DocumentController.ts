const Document = require('../../db/models/document');
const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Topic = require('../../db/models/topic');

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

type ResponseUploadFile = {
    name: string,
    url: string,
}

interface RequestWithFile extends Request {
    file: Express.Multer.File;
    files: Express.Multer.File[];
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
            res.status(500).json({ error });
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
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/teacher/:teacherId
    getDocumentCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const teacherId = req.params.teacherId;
            const teacherAuthId = req.teacher.data.id;
            if (teacherId != teacherAuthId) 
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            const documents = await Document.findAll({
                where: { id_teacher: teacherId }
            });

            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/folder/:parentId/
    getDocumentBelongToFolder = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const parentId = req.params.parentId;
            console.log(parentId)
            let idToFind = null;

            if (parseInt(parentId, 10) > 0) idToFind = parentId;

            const documents = await Document.findAll({
                where: { parent_folder_id: idToFind }
            });

            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
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
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/:chapterId
    getDocumentBelongToChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/:topicId
    getDocumentBelongToTopic = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /api/v1/document
    createDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.teacher.data.id;
            const body = req.body;

            const newDocument = await Document.create({ ...body });
            
            res.status(201).json(newDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    createMultiDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.teacher.data.id;

            const documentsData = req.body
            let parentId = null;

            if (documentsData.parentId > 0) {
                parentId = documentsData.parentId;
            }

            let createdDocuments = [];

            for (const body of documentsData) {
                const newDocument = await Document.create({
                    name: body.name,
                    url: body.url,
                    parent_folder_id: parentId,
                    id_teacher
                });

                createdDocuments.push(newDocument);
            }

            return res.status(201).json(createdDocuments);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
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
            res.status(500).json({ error });
        }
    }

    uploadMultiFile = async (req: RequestWithFile, res: Response, _next: NextFunction) => {
        try {
            const storage = getStorage();

            const urls: ResponseUploadFile[] = [];

            const uploadPromises = req.files.map(async (file) => {
                const dateTime = DocumentFile.giveCurrentDateTime();
                const storageRef = ref(storage, `document/${file.originalname + "       " + dateTime}`)
            
                // Create file metadata including the content type
                const metadata = {
                    contentType: file.mimetype,
                };
            
                const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
                const url = await getDownloadURL(snapshot.ref);
                urls.push({
                    name: file.originalname,
                    url
                })
            });
            
            await Promise.all(uploadPromises);
            
            res.status(200).send(urls);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [PUT] /api/v1/document/:documentId
    updateDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;
            
            const documentId = req.params.documentId;

            const updatedDocument = Document.findByPk(documentId);
            const teacherId = updatedDocument.id_teacher;
            if (teacherId !== req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            updatedDocument.update(body);
            
            res.status(200).json(updatedDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /api/v1/document/:documentId
    deleteDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const documentId = req.params.documentId;

            const document = await Document.findByPk(documentId);
            if (!document) return res.status(404).json({ message: "Document does not exist!"});

            const teacherId = document.id_teacher;

            if (teacherId !== req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            await document.destroy();

            res.status(200).json({ 
                message: "Document has been deleted",
                documentId
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /api/v1/document
    deleteMultiDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { teacherId } = req.body;
            if (teacherId !== req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            const documentIds = req.body.documentIds;
            const existingId = await Document.findAll({
                where: { id: documentIds }
            }).map((document: any) => document.id)
            await Document.destroy({ where: { id: existingId } });

            res.status(200).json({ message: "All selected document have been deleted!" });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new DocumentController();