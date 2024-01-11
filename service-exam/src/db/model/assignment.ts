const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

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
        references: {
            model: 'exam',
            key: 'id'
        }
    },
    id_student: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
    timestamps: false,
});

module.exports = Assignment;