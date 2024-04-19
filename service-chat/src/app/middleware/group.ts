import { Request, Response, NextFunction } from 'express';
const createError = require('http-errors');

const Group = require('../../db/model/group');

const axios = require('axios');


class CheckingGroup {
    checkGetGroupOfUser = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }

    checkCreateGroup = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const { name, members, individual } = body;
            if (!name) {
                let error = "Group must have a name!";
                return next(createError.BadRequest(error));
            }

            if (!members) {
                let error = "You can not create a group with just you a member!";
                return next(createError.BadRequest(error));
            }

            for (const user of members) {
                try {
                    const student = await axios.get(`${process.env.BASE_URL_USER_LOCAL}/student/${user}`);
                } catch (error: any) {
                    try {
                        const teacher = await axios.get(`${process.env.BASE_URL_USER_LOCAL}/teacher/get-teacher-by-id/${user}`);
                    } catch (error) {
                        let e = `User with id: ${user} does not exist!`;
                        return next(createError.BadRequest(e));
                    }
                }
            }

            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkSetAdminForGroup = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }

    checkAddUserToGroup = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }

    checkRemoveUserFromGroup = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }
}


module.exports = new CheckingGroup();