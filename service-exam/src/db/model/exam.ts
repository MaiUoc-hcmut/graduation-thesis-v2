const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Question = require('./question');

class Exam extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Exam.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_course: {
        type: DataTypes.UUID,
    },
    id_category: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    period: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    quantity_question: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    quantity_assignment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'exam',
});

module.exports = Exam;

Exam.belongsToMany(Question, { through: 'exam_question' });
Question.belongsToMany(Exam, { through: 'exam_question' });

Exam.sync();
Question.sync()