const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class Folder extends Model {}

Folder.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        parent_folder_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        id_teacher: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        name: {
            type: DataTypes.STRING(100)
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'folder',
        freezeTableName: true,
        sequelize
    }
);

module.exports = Folder;