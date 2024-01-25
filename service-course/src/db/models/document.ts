const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';
const Category = require('./category');
const Lecture = require('./lecture');
const Folder = require('./folder');

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
        parent_folder_id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        tableName: 'document',
        freezeTableName: true,
        sequelize
    }
);


Document.belongsToMany(Category, { through: 'documentcategory', foreignKey: "documentId" });
Category.belongsToMany(Document, { through: 'documentcategory', foreignKey: "categoryId" });

Document.belongsToMany(Lecture, { through: 'documentlecture', foreignKey: "documentId" });
Lecture.belongsToMany(Document, { through: 'documentlecture', foreignKey: "lectureId" });

Document.belongsTo(Folder, { foreignKey: 'parent_folder_id' });
Folder.hasMany(Document, { foreignKey: 'parent_folder_id' });

module.exports = Document;