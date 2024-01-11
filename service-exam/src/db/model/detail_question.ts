const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class DetailQuestion extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

DetailQuestion.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_student: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_assignment: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'assignment',
            key: 'id'
        }
    },
    id_exam: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'exam',
            key: 'id'
      }
    },
    id_question: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'question',
            key: 'id'
        }
    },
}, {
    sequelize,
    tableName: 'detail_question',
});

module.exports = DetailQuestion;