const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class Category extends Model {}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        tableName: 'categories',
        freezeTableName: true,
        sequelize
    }
)

module.exports = Category;