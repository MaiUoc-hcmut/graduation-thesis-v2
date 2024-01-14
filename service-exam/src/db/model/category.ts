const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class Category extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_par_category: {
        type: DataTypes.UUID,
        references: {
            model: 'Par_category',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
    }

}, {
    sequelize,
    tableName: 'category',
});

// Par_category.belongsToMany(Question, { through: 'Par_category_question' });
// Question.belongsToMany(Exam, { through: 'exam_question' });



module.exports = Category
