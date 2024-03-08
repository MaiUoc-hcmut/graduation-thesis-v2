const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class Question extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Question.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    content_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content_image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    total_report: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    multi_choice: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'question',
});

module.exports = Question;
