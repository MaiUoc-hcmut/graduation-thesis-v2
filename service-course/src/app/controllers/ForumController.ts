const Forum = require('../../db/models/forum');
const TopicForum = require('../../db/models/topicforum');

import { Request, Response, NextFunction } from 'express';

require('dotenv').config();

class ForumController {

    // [GET] /forums/page/:page
    getAllForum = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');
            const count = await Forum.count();

            const forums = await Forum.findAll({
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            res.status(200).json({ count, forums });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /forums/:courseId/page/:page
    getDetailForumByCourseId = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_course = req.params.courseId;
            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const forum = await Forum.findOne({
                where: { id_course },
                include: [
                    {
                        model: TopicForum,
                        as: 'topics',
                        attributes: ['id', 'title', 'createdAt', 'total_answer', 'id_user'],
                        through: {
                            attributes: []
                        },
                        limit: pageSize,
                        offset: pageSize * (currentPage - 1)
                    }
                ]
            });

            res.status(200).json(forum);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}


module.exports = new ForumController();