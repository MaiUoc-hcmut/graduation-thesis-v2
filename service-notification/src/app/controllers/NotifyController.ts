const NotificationModel = require('../../db/model/notification');
const RoomSocket = require('../../db/model/room');

import { Request, Response, NextFunction } from "express";
import { socketInstance } from "../..";


const { sequelize } = require('../../config/db/index');

class NotificationController {

    // [GET] /notification/create-course
    notifyCreateCourse = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const { id_user, id_course, name } = req.body;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            const findUser = clientConnected.find(obj => obj.user === id_user);
            if (findUser) {
                io.to(`${findUser.socket}`).emit("created_course", {
                    message: "Course has been created!",
                    course: id_course,
                    name
                });
            }

            const newNoti = await NotificationModel.create({
                id_user,
                content: "Khóa học được tạo thành công"
            }, {
                transaction: t
            });

            await t.commit();

            res.status(200).json({
                message: "Notification has been sent to user!",
                newNoti
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });

            await t.rollback();
        }
    }

    // [GET] /notification/create-exam
    notifyCreateExam = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const { id_user, id_exam, name } = req.body;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            const findUser = clientConnected.find(obj => obj.user === id_user);
            if (findUser) {
                io.to(findUser.socket).emit("created_exam", {
                    message: "Exam has been created!",
                    exam: id_exam,
                    name
                });
            }

            const newNoti = await NotificationModel.create({
                id_user,
                content: "Đề thi được tạo thành công"
            }, {
                transaction: t
            });

            await t.commit();

            res.status(200).json({
                message: "Notification has been sent to user!",
                newNoti
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });

            await t.rollback();
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
        const t = await sequelize.transaction();
        try {
            const { id_forum } = req.body.data;

            const io = socketInstance.getIoInstance();

            io.to(`${id_forum}`).emit("created_topic", {
                message: "A user had have created a topic in forum",
                forum: id_forum
            });

            const usersInRoom = await RoomSocket.findAll({
                where: { room: id_forum }
            });

            const dataToCreate = usersInRoom.map((user: any) => ({
                id_user: user.id_user,
                content: "Có người vừa tạo topic mới ở trong forum"
            }));

            const notifications = await NotificationModel.bulkCreate(dataToCreate);

            await t.commit();

            res.status(200).json({
                message: "Notification has been sent to user!",
                notifications
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });

            await t.rollback();
        }
    }

    // [GET] /notification/upload-video
    notifyUploadVideo = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { url, name, id_user } = req.body;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            const findUser = clientConnected.find(obj => obj.user === id_user);
            if (findUser) {
                io.to(findUser.socket).emit("uploaded_video", {
                    message: "Video has been uploaded to cloud!",
                    url,
                    name
                });
            }

            res.status(200).json({
                message: "Notification has been sent to user!",
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [PUT] /notification/read-noti
    readNotification = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const notifications = req.body.data;

            await NotificationModel.update({ read: true }, {
                where: {
                    id: notifications
                }
            });

            res.status(200).json({
                message: "All notification have read",
                notifications
            });

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [GET] /notification/get-noti/:userId
    getNotificationOfUser = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_user = req.params.userId;

            const notifications = await NotificationModel.findAll({
                where: { id_user }
            });

            res.status(200).json(notifications);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [POST] /notification/create-answer/:topicId
    notifyCreateAnswer = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_topic = req.params.topicId;

            
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [POST] /notification/teacher-send
    teacherSendNotification = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const { room, ...message } = body;

            const io = socketInstance.getIoInstance();

            io.to(`${room}`).emit("teacher_send_notification", {
                ...message
            });

            const usersInRoom = await RoomSocket.findAll({
                where: { room }
            });

            const dataToCreate = usersInRoom.map((user: any) => ({
                id_user: user.id_user,
                content: message.message
            }));

            const notifications = await NotificationModel.bulkCreate(dataToCreate);

            res.status(201).json(notifications);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }

    // [GET] /notification/payment
    notifyPayment = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;

            console.log(body);

            const io = socketInstance.getIoInstance();

            io.to(body.user).emit("payment_done", {
                body
            });

            res.status(200).json({
                mesasge: "Notification has been sent to user!"
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ message: error.message, error });
        }
    }
}

module.exports = new NotificationController();