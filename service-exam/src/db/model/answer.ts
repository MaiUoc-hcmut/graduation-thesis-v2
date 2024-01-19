const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const DetailQuestion = require('./detail_question');

class Answer extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Answer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_question: {
        type: DataTypes.UUID,
        references: {
            model: 'question',
            key: 'id',
        }
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    content_text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content_image: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    tableName: 'answer',
    timestamps: false
});

module.exports = Answer;

Answer.belongsToMany(DetailQuestion, { through: 'select_answer' });
DetailQuestion.belongsToMany(Answer, { through: 'select_answer' });

Answer.sync();
DetailQuestion.sync();