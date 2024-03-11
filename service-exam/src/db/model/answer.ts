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
});

module.exports = Answer;

Answer.belongsToMany(DetailQuestion, { through: 'selected-answer' });
DetailQuestion.belongsToMany(Answer, { through: 'selected-answer' });