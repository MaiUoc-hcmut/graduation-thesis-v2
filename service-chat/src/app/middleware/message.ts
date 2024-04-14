import { Request, Response, NextFunction } from 'express';
const createError = require('http-errors');

const Group = require('../../db/model/group');


class CheckingMessage {
    checkCreateMessage = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const author = req.user?.user.data.id;
            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            if (!body.body) {
                let error = "Message must contain body"
                return next(createError.BadRequest(error));
            }

            if (!body.id_group) {
                let error = "Message must send to specific group, you do not attach group id!";
                return next(createError.BadRequest(error));
            }

            const group = await Group.findOne({ id: body.id_group });
            if (!group) {
                let error = "Group does not exist!";
                return next(createError.BadRequest(error));
            }

            if (!group.members.includes(author)) {
                let error = "You do not in this group!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkGetMessageInGroup = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingMessage();