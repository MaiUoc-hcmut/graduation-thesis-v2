const Message = require('../../db/model/message');
const Group = require('../../db/model/group');

import { Request, Response, NextFunction } from 'express';
import { socketInstance } from "../..";
import { log } from 'console';

const axios = require('axios');

require('dotenv').config();
class GroupController {

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

    // [GET] /groups/:groupId
    getGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [GET] /groups/list
    getGroupsOfUser = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_user = req.user?.user.data.id;
            console.log(id_user);
            const groups = await Group.aggregate([
                {
                    $match: {
                        members: id_user
                    }
                },
                {
                    $group: {
                        _id: "$individual",
                        groups: { $push: "$$ROOT" }
                    }
                },
                {
                    $unwind: "$groups"
                },
                {
                    $sort: {
                        "groups.updatedAt": -1
                    }
                },
            ]);

            let classify: {
                student: any[],
                teacher: any[],
                mix: any[],
            } = {
                student: [],
                teacher: [],
                mix: [],
            };

            for (const group of groups) {
                if (group._id === true) {
                    for (const member of group.groups.members) {
                        if (member !== id_user) {
                            const student = await this.getUserFromAPI(`${process.env.BASE_URL_USER_LOCAL}/student/${member}`);
                            if (student) {
                                group.groups.friend = {
                                    id: student.data.id,
                                    name: student.data.name,
                                    avatar: student.data.avatar
                                }
                                classify.student.push(group.groups);
                                break;
                            }

                            const teacher = await this.getUserFromAPI(`${process.env.BASE_URL_USER_LOCAL}/teacher/get-teacher-by-id/${member}`);
                            if (teacher) {
                                group.groups.friend = {
                                    id: teacher.data.id,
                                    name: teacher.data.name,
                                    avatar: teacher.data.avatar
                                }
                                classify.teacher.push(group.groups);
                                break;
                            }
                        }
                    }
                } else {
                    classify.mix.push(group.groups);
                }
            }

            res.status(200).json(classify);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [POST] /groups
    createGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const admins: string[] = [req.user?.user.data.id];

            const io = socketInstance.getIoInstance();
            const clientConnected = socketInstance.getClientConnected();

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            let { name, members, individual } = body;

            members = Array.from(new Set(members));

            individual = (individual === undefined || individual === "") ? true : individual;
            if (members.length > 1 && individual) {
                return res.status(400).json({
                    message: "If group have at least 3 members, this group is not individual group"
                });
            }

            members.push(req.user?.user.data.id);

            const group = await Group.create({
                name,
                members,
                individual,
                admins
            });

            for (const member of members) {
                const memberOnline = clientConnected.find(o => o.user === member);
                if (memberOnline) {

                    io.to(`${memberOnline.socket}`).emit("new_group_created", {
                        id_group: group.id,
                        group_name: name,
                        admin: req.user?.user.data.id
                    });
                }
            }

            res.status(201).json(group);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [PUT] /groups/:groupId/set-admin
    setAdminForGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [PUT] /groups/:groupId/add-new-users
    addNewUserToGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_group = req.params.groupId;

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const group = await Group.findOne({ id: id_group });
            group.members.push(...body.users);

            await group.save();

            res.status(200).json(group);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [PUT] /groups/:groupId/remove-users
    removeUserFromGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_group = req.params.groupId;

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const group = await Group.findOne({ id: id_group });
            group.members = group.members.filter((member: string) => !body.users.includes(member));

            await group.save();

            res.status(200).json(group);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }
}


module.exports = new GroupController()