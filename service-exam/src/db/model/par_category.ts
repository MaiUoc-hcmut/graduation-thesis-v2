const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Category = require('./category');

class Par_category extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Par_category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    }

}, {
    sequelize,
    tableName: 'par_category',
});

// Par_category.belongsToMany(Question, { through: 'Par_category_question' });
// Question.belongsToMany(Exam, { through: 'exam_question' });

Par_category.hasMany(Category)

module.exports = Par_category
