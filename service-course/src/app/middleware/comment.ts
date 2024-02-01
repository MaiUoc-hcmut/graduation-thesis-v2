const Comment = require('../../db/models/comment');
const Lecture = require('../../db/models/lecture');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingComment {
    checkParentCreateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id_parent, id_lecture } = req.body.data;
            const lecture = await Lecture.findByPk(id_lecture);
            if (!lecture) return next(createError.NotFound("Lecture does not exist"));
            if (id_parent) {
                const parentComment = await Comment.findByPk(id_parent);
                if (!parentComment) return next(createError.NotFound("Parent comment not found"));
                if (parentComment.id_lecture !== id_lecture) return next(createError.BadRequest("Parent comment does not belong to lecture"));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingComment();