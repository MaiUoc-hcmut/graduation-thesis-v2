const Comment = require('../../db/models/comment');
const Topic = require('../../db/models/topic');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingComment {
    checkParentCreateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id_parent, id_topic } = req.body.data;
            const topic = await Topic.findByPk(id_topic);
            if (!topic) return next(createError.NotFound("Topic does not exist"));
            if (id_parent) {
                const parentComment = await Comment.findByPk(id_parent);
                if (!parentComment) return next(createError.NotFound("Parent comment not found"));
                if (parentComment.id_topic !== id_topic) return next(createError.BadRequest("Parent comment does not belong to Topic"));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingComment();