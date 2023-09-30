const Course = require('../../db/models/course')
const Chapter = require('../../db/models/chapter')
import { Request, Response, NextFunction } from "express";

class CourseController {
    // [GET] /courses/:id
    getCourse(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id
        Course.findByPk(id).then((course: any) =>
            res.send(course))
            .catch(next);
    }

    // [GET] /courses
    getAllCourse(req: Request, res: Response, next: NextFunction) {
        Course.findAll().then((course: any) =>
            res.send(course))
            .catch(next);
    }

    // [GET] /courses/all
    getAllCourseFull(req: Request, res: Response, next: NextFunction) {
        Course.findByPk(req.params.id, { include: ["chapters"] }).then((course: any) =>
            res.send(course))
            .catch(next);
    }

    // [POST] /courses/create
    create(req: Request, res: Response, next: NextFunction) {
        const course = Course.build(req.body);
        course
            .save()
            .then(() =>
                res.send(course))
            .catch(next);
    }

    // [PUT] /courses/:id
    update(req: Request, res: Response, next: NextFunction) {
        Course.update(req.body, {
            where: {
                id: req.params.id
            }
        })
            .then((course: any) =>
                res.send(course))
            .catch(next);
    }

    // [DELETE] /courses/:id
    delete(req: Request, res: Response, next: NextFunction) {
        Course.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(res.send({}))
            .catch(next);
    }

}

module.exports = new CourseController();
