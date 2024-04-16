const Message = require('../../db/model/message');
const Group = require('../../db/model/group');

import { Request, Response, NextFunction } from 'express';


class GroupController {
     
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

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            let { name, members, individual } = body;

            individual = (individual === undefined || individual === "") ? true : false;


            const group = await Group.create({
                name,
                members,
                individual,
                admins
            });

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

    // [PUT] /groups/:groupId/add-new-user
    addNewUserToGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_group = req.params.groupId;

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const group = await Group.findOne({ id: id_group });
            group.members.push(...body);

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

    // [PUT] /groups/:groupId/remove-user
    removeUserFromGroup = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_group = req.params.groupId;

            
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