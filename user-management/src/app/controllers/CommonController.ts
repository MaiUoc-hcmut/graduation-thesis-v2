const Student = require('../models/student');
const Teacher = require('../models/teacher');


import { Request, Response, NextFunction } from 'express';

const { Op } = require('sequelize');
const { sequelize } = require('../../config/db/index');


class CommonController {

    // [GET] /commons/search?query=
    searchUser = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { query } = req.query;

            const result: any[] = [];

            const students = await Student.findAll({
                where: {
                    email: {
                        [Op.like]: `%${query}%`
                    }
                }
            });

            const teachers = await Teacher.findAll({
                where: {
                    email: {
                        [Op.like]: sequelize.fn('lower', `%${query}%`)
                    }
                }
            });

            result.push(...students);
            result.push(...teachers);

            res.status(200).json(result);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                message: error.message,
                error
            })
        }
    }
}


module.exports = new CommonController();