const Lecture = require('../../db/models/lecture')
const Chapter = require('../../db/models/chapter')
import { Request, Response, NextFunction } from "express";

class LectureController {
    // [GET] courses/lectures/:id
    getLecture(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id
        Lecture.findByPk(id).then((lecture: any) =>
            res.send(lecture))
            .catch(next);
    }

    // [GET] /lectures
    getAllLecture(req: Request, res: Response, next: NextFunction) {
        Chapter.findByPk(req.body.data.id_chapter, { include: ["lectures"] }).then((chapter: any) =>
            res.send(chapter.lectures))
            .catch(next);
    }

    // [POST] /lectures/create
    create(req: Request, res: Response, next: NextFunction) {
        const lecture = Lecture.build(req.body.data);
        lecture
            .save()
            .then((lecture: any) => {
                res.send(lecture)
            })
            .catch(next);
    }

    // [PUT] /lectures/:id
    update(req: Request, res: Response, next: NextFunction) {
        Lecture.update(req.body.data, {
            where: {
                id: req.params.id
            }
        })
            .then((lecture: any) =>
                res.send(lecture))
            .catch(next);
    }

    // [DELETE] /lectures/:id
    delete(req: Request, res: Response, next: NextFunction) {
        Lecture.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(res.send({}))
            .catch((err: Error) => { throw err });
    }

}

module.exports = new LectureController();
