const Chapter = require('../../db/models/chapter')
const Course = require('../../db/models/course')
import { Request, Response, NextFunction } from "express";

class ChapterController {
    // [GET] courses/chapters/:id
    getChapter(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id
        Chapter.findByPk(id).then((chapter: any) =>
            res.send(chapter))
            .catch(next);
    }

    // [GET] /chapters
    getAllChapter(req: Request, res: Response, next: NextFunction) {
        Course.findByPk(req.query.id_course, { include: ["chapters"] }).then((course: any) =>
            res.send(course.chapters))
            .catch(next);
    }

    // [GET] /chapters/:id/all
    getChapterFull(req: Request, res: Response, next: NextFunction) {
        Chapter.findAll({ where: { id_course: req.query.id_course }, include: ["lectures"] }).then((chapter: any) =>
            res.send(chapter))
            .catch(next);
    }

    // [POST] /chapters/create
    create(req: Request, res: Response, next: NextFunction) {
        const chapter = Chapter.build(req.body.data);
        chapter
            .save()
            .then((chapter: any) => {
                res.send(chapter)
            })
            .catch(next);
    }

    // [PUT] /chapters/:id
    update(req: Request, res: Response, next: NextFunction) {
        Chapter.update(req.body.data, {
            where: {
                id: req.params.id
            }
        })
            .then((chapter: any) =>
                res.send(chapter))
            .catch(next);
    }

    // [DELETE] /chapters/:id
    delete(req: Request, res: Response, next: NextFunction) {
        Chapter.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(res.send({}))
            .catch((err: Error) => { throw err });
    }

}

module.exports = new ChapterController();
