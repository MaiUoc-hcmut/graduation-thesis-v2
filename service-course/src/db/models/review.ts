const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class Review extends Model {}

Review.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        id_student: {
            type: DataTypes.UUID,
            allowNull: false
        },
        id_teacher: DataTypes.UUID,
        id_course: DataTypes.UUID,
        id_exam: DataTypes.UUID,
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        image: DataTypes.STRING(255),
        rating: DataTypes.FLOAT.UNSIGNED,
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'review',
        freezeTableName: true,
        sequelize
    }
);

module.exports = Review;