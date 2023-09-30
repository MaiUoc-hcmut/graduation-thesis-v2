const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';
const Category = require('./category');
const Lecture = require('./lecture');

class Document extends Model {}

Document.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        id_teacher: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
        },
        url: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        downloads: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        createdAt :{
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    },
    {
        tableName: 'documents',
        freezeTableName: true,
        sequelize
    }
);


Document.belongsToMany(Category, { through: 'documentcategory', foreignKey: "documentId" });
Category.belongsToMany(Document, { through: 'documentcategory', foreignKey: "categoryId" });

Document.belongsToMany(Lecture, { through: 'documentlecture', foreignKey: "documentId" });
Lecture.belongsToMany(Document, { through: 'documentlecture', foreignKey: "lectureId" });

module.exports = Document;