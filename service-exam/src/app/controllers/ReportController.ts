const ReportError = require('../../db/model/report_error');

const { sequelize } = require('../../config/db/index');
const axios = require('axios');

import { Request, Response, NextFunction } from "express";

require('dotenv').config();


class ReportController {

    // [GET] /reports/:questionId
    getReportOfQuestion = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_question = req.params.questionId;

            const reports = await ReportError.findAll({
                where: { id_question }
            });

            res.status(200).json(reports);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }

    // [POST] /reports/:questionId
    studentReportErrorOfQuestion = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_student = req.student?.data.id;
            const id_question = req.params.questionId;

            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            let reportList :any[] = [];
            for (const rp of body) {
                const report = await ReportError.create({
                    ...rp,
                    id_student,
                    id_question
                }, {
                    transaction: t
                });
                reportList.push(report);
            }

            await t.commit();

            res.status(201).json(reportList);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });

            await t.rollback();
        }
    }
}

module.exports = new ReportController();