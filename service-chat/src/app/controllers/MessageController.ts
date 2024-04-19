const Message = require('../../db/model/message');

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

    // [GET] /messages/groups/:groupId/scroll/:scroll
    getMessagesInGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_group = req.params.groupId;
            const scroll = +req.params.scroll;

            const scrollSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const offset = (scroll - 1) * scrollSize;

            const messages = await Message.find({
                id_group
            }).skip(offset).limit(scrollSize).sort({ createdAt: -1 }).exec();

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
            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const author = req.user?.user.data.id;

            const message = await Message.create({
                ...body,
                author
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