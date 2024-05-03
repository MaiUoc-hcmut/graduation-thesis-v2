const Message = require('../../db/model/message');
const Group = require('../../db/model/group');

import { Request, Response, NextFunction } from 'express';

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
                    individual: true
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