const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Chapter = require('./chapter');
const Topic = require('./topic');
const Category = require('./category');

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
    id_topic_forum: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_parent: {
        type: DataTypes.UUID
    },
    content: {
        type: DataTypes.STRING(600),
        allowNull: false,
    },
    file: {
        type: DataTypes.TEXT,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "student",
    }
}, {
    tableName: 'answer',
    sequelize
});

module.exports = Answer;