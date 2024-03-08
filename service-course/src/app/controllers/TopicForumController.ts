const Forum = require('../../db/models/forum');
const TopicForum = require('../../db/models/topicforum');
const Answer = require('../../db/models/answer');

const FileUpload = require('../../config/firebase/fileUpload');

import { Request, Response, NextFunction } from 'express';

const { sequelize } = require('../../config/db/index');

require('dotenv').config();

class TopicForumController {
    // [GET] /topicsforum/:topicId/page/:page
    getDetailTopicById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_topic = req.params.topicId;

            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const topic = await TopicForum.findByPk(id_topic, {
                include: [
                    {
                        where: { id_parent: null },
                        model: Answer,
                        as: 'answers',
                        limit: 3,
                        offset: pageSize * (currentPage - 1),
                        include: [
                            // Include replies (answers) of each answer
                            {
                                model: Answer,
                                as: 'replies',
                                separate: true, // Ensure that replies are loaded separately
                                limit: 10, // Limit the number of replies for each answer
                                order: [['createdAt', 'ASC']] // You can adjust the ordering as needed
                            }
                        ]
                    }
                ]
            });

            res.status(200).json(topic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /topicsforum
    createTopic = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;

        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const t = await sequelize.transaction();

        try {
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const topic = await TopicForum.create({
                id_user,
                role,
                ...body
            }, {
                transaction: t
            });

            const forum = await Forum.findByPk(body.id_forum);

            const total_topic = forum.total_topic + 1;

            await forum.update({ total_topic }, { transaction: t });

            await t.commit()

            res.status(201).json(topic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    // [DELETE] /topicsforum/:topicId
    deleteTopic = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_topic = req.params.topicId;

            const topic = await TopicForum.findByPk(id_topic);

            console.log(topic);

            const forum = await Forum.findByPk(topic.id_forum);
            const total_topic = forum.total_topic - 1;
            await forum.update({ total_topic }, { transaction: t });

            await topic.destroy({ transaction: t });

            await t.commit()

            res.status(200).json({
                message: "Topic has been deleted",
                id: id_topic
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }
}


module.exports = new TopicForumController();