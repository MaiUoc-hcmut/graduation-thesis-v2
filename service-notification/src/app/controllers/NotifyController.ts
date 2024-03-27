const NotificationModel = require('../../db/model/notification');

import { Request, Response, NextFunction } from "express";
import { socketInstance } from "../..";

class NotificationController {

    // [GET] /notification/create-course
    notifyCreateCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id_user, id_course } = req.body;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            const findUser = clientConnected.find(obj => obj.user === id_user);
            if (findUser) {
                io.to(findUser.socket).emit("created_course", {
                    message: "Course has been created!",
                    course: id_course
                });
            }

            res.status(200).json({
                message: "Notification has been sent to user!"
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [GET] /notification/create-exam
    notifyCreateExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id_user, id_exam } = req.body;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            const findUser = clientConnected.find(obj => obj.user === id_user);
            if (findUser) {
                io.to(findUser.socket).emit("created_exam", {
                    message: "Exam has been created!",
                    exam: id_exam
                });
            }

            res.status(200).json({
                message: "Notification has been sent to user!"
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [POST] /notification/report-error
    notifyReportErrorOfQuestion = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id_user, id_question, id_exam } = req.body;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            const findUser = clientConnected.find(obj => obj.user === id_user);
            if (findUser) {
                io.to(findUser.socket).emit("reported_error", {
                    message: "You have a report about the question!",
                    question: id_question,
                    exam: id_exam
                });
            }

            const newNoti = await NotificationModel.create({
                id_user,
                content: "Student has reported about the question"
            });

            res.status(200).json({
                message: "Notification has been sent to user!",
                notification: newNoti
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [POST] /notification/create-topic
    notifyCreateTopic = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { id_forum } = req.body;

            const io = socketInstance.getIoInstance();

            io.to(`${id_forum}`).emit("created_topic", {
                message: "A user had have created a topic in forum",
                forum: id_forum
            });

            res.status(200).json({
                message: "Notification has been sent to user!",
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [POST] /notification/teacher-send
    teacherSendNotification = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }
}

module.exports = new NotificationController();