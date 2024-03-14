const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

const DetailQuestion = require('./detail_question');

class Assignment extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Assignment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_exam: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_student: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    passed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    right_question: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    wrong_question: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    empty_question: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    time_start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    time_end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'assignment',
});

Assignment.hasMany(DetailQuestion, { foreignKey: 'id_assignment', as: 'details' });
DetailQuestion.belongsTo(Assignment, { foreignKey: 'id_assignment' });

module.exports = Assignment;