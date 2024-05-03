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

            if (body.user && body.id_group) {
                let error = "You just allowed to send the message to an user or a group, not both!";
                return next(createError.BadRequest(error));
            }

            if (!body.user && body.id_group) {
                let error = "You must send provide id_user or id_group!";
                return next(createError.BadRequest(error));
            }

            if (body.id_group) {
                const group = await Group.findOne({ id: body.id_group });
                if (!group) {
                    let error = "Group does not exist!";
                    return next(createError.BadRequest(error));
                }

                if (!group.members.includes(author)) {
                    let error = "You do not in this group!";
                    return next(createError.Unauthorized(error));
                }
            }
            
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkGetMessageInGroup = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_user = req.user?.user.data.id;
            const id_group = req.params.groupId;

            const group = await Group.findOne({
                id: id_group
            });
            if (!group) {
                let error = "Group does not exist!";
                return next(createError.BadRequest(error));
            }
            if (!group.members.includes(id_user)) {
                let error = "You are not in this group to get messages";
                return next(createError.Unauthorized(error));
            }
            next()
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingMessage();