const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class Category_Exam extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Category_Exam.init({
    id_exam: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Exam',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_category: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Category',
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
}, {
    sequelize,
    tableName: 'category-exam',
});


module.exports = Category_Exam
