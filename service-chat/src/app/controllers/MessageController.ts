const Message = require('../../db/model/message');
const Group = require('../../db/model/group');

import { Request, Response, NextFunction } from 'express';
import { socketInstance } from "../..";

const axios = require('axios');

require('dotenv').config();

declare global {
    namespace Express {
        interface Request {
            teacher?: any;
            student?: any;
            user?: USER;
        }

        type USER = {
            user?: any,
            role?: string,
            authority?: number
        }
    }
}

class MessageController {

    getUserFromAPI = async (url: string) => {
        try {
            const response = await axios.get(url);
            return {
                data: response.data
            }
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            } else {
                throw error;
            }
        }
    }

    // [GET] /messages
    getAllMessage = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const messages = await Message.find();

            res.status(200).json(messages);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [GET] /messages/groups/:groupId
    getMessagesInGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_group = req.params.groupId;
            const scrollSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            let cutoff: any;

            const lastMessage = req.query.lastMessage;
            if (lastMessage) {
                const message = await Message.findOne({
                    id: lastMessage
                });
                if (!message) {
                    return res.status(400).json({
                        message: "Last message does not exist",
                        id: lastMessage
                    });
                }
                cutoff = new Date(message.createdAt);
            } else {
                cutoff = new Date();
            }

            const messages = await Message.find({
                id_group,
                createdAt: {
                    $lt: cutoff
                }
            }).sort({ createdAt: -1 }).limit(scrollSize).exec();

            for (const message of messages) {
                const student = await this.getUserFromAPI(`${process.env.BASE_URL_USER_LOCAL}/student/${message.author}`);
                if (student) {
                    delete message.author;
                    message.author = {
                        id: student.data.id,
                        name: student.data.name,
                        avatar: student.data.avatar
                    }
                    continue;
                }

                const teacher = await this.getUserFromAPI(`${process.env.BASE_URL_USER_LOCAL}/teacher/get-teacher-by-id/${message.author}`);
                if (teacher) {
                    delete message.author;
                    message.author = {
                        id: teacher.data.id,
                        name: teacher.data.name,
                        avatar: teacher.data.avatar
                    }
                    continue;
                }
            }

            res.status(200).json(messages);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [POST] /messages
    createMessage = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const author = req.user?.user.data.id;
            const authorName = req.user?.user.data.name;
            const authorAvatar = req.user?.user.data.avatar;

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            let id_group = body.id_group;

            if (body.user) {
                await Group.create({
                    members: [author, body.user],
                    admins: [author, body.user],
                    lastMessage: body.body,
                    lastSenderId: author,
                    lastSenderName: authorName,
                    individual: true
                });

                const userOnline = clientConnected.find(o => o.user === body.user);
                if (userOnline) {
                    io.to(`${userOnline.socket}`).emit("new_message_created", {
                        message: body.body,
                        author: {
                            id: author,
                            name: authorName,
                            avatar: authorAvatar
                        }
                    })
                }
            } else {
                const group = await Group.findOne({
                    id: id_group
                });
                group.lastMessage = body.body;
                group.lastSenderId = author;
                group.lastSenderName = authorName;
                await group.save();

                io.to(id_group).emit("new_message_created", {
                    message: body.body,
                    author: {
                        id: author,
                        name: authorName,
                        avatar: authorAvatar
                    }
                });
            }

            const message = await Message.create({
                author,
                body: body.body,
                id_group
            });

            res.status(201).json(message);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }
}

module.exports = new MessageController();