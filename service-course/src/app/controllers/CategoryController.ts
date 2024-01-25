const Category = require('../../db/models/category');

import { Request, Response, NextFunction } from 'express';

class CategoryController {

    // [GET] /categories
    getAllCategory = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const categories = await Category.findAll();

            res.status(200).json(categories);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /categories/:categoryId
    getCategoryById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.params.categoryId;

            const category = await Category.findByPk(id);

            if (!category) return res.status(404).json({ message: "The category does not exist" });

            res.status(200).json(category);          
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /categories/parent/:parentId
    getCategoryGroupByParent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const parentId = req.params.parentId;

            const categories = await Category.findAll({
                where: { id_par_category: parentId }
            });

            res.status(200).json(categories);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /categories
    createCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;

            const newCategories: any[] = [];
            const failedCategory: {
                name?: string,
                message?: string,
            }[] = [];

            for (let i = 0; i < body.length; i++) {
                const existedCategory = await Category.findAll({
                    where: { name: body[i].name }
                });

                if (existedCategory.length > 0) {
                    failedCategory.push({ name: body[i].name, message: "The category already exist" });
                    continue;
                }
                const newCategory = await Category.create(body[i]);
                newCategories.push(newCategory);
            }

            res.status(201).json({ success: newCategories, failed: failedCategory });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /categories/:categoryId
    updateCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.params.categoryId;

            const category = Category.findByPk(id);

            if (!category) return res.status(404).json({ message: "The category does not exist" });

            if (req.body.name !== undefined) {
                const existedCategory = await Category.findAll({
                    where: { name: req.body.name }
                });
                if (existedCategory.length > 0) {
                    return res.status(400).json({
                        message: "The category you want to update for is already exist"
                    })
                }
            }

            await category.update(req.body);

            res.status(200).json(category);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /categories/:categoryId
    deleteCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.params.categoryId;

            const category = await Category.findByPk(id);

            if (!category) return res.status(404).json({ message: "The category does not exist" });

            await category.destroy();

            res.status(200).json({
                id,
                message: "Category has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController();