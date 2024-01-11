
const { DataTypes } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'DataTypes';

class Exam extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}
Exam.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(12),
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING(20),
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        tableName: 'exam',
        DataTypes,
    },
);

module.exports = Exam
