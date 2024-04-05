const Comment = require('../../db/models/comment');
const Chapter = require('../../db/models/chapter');
const Topic = require('../../db/models/topic');
const StudentCourse = require('../../db/models/student-course');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingComment {
    checkCreateComment = async (req: Request, _res: Response, next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        try {
            const { id_parent, id_topic } = body;

            const id_user = req.user?.user.data.id;

            const topic = await Topic.findByPk(id_topic);
            if (!topic) return next(createError.NotFound("Topic does not exist"));

            if (id_parent) {
                const parentComment = await Comment.findByPk(id_parent);
                if (!parentComment) return next(createError.NotFound("Parent comment not found"));

                if (parentComment.id_topic !== id_topic) return next(createError.BadRequest("Parent comment does not belong to Topic"));

                if (parentComment.id_parent) {
                    let error = "Your parent comment is a child of another comment, means the comment you want to create cannot be a child of this comment";
                    return next(createError.BadRequest(error));
                }
            }

            const chapter = await Chapter.findByPk(topic.id_chapter);
            const record = await StudentCourse.findOne({
                where: {
                    id_student: id_user,
                    id_course: chapter.id_course
                }
            });

            if (!record) {
                let error = "You must buy this course to comment on topic!"
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingComment();