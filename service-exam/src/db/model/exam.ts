
const { DataTypes } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'DataTypes';

class Exam extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}
Exam.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(12),
        },
        id_teacher: {
            allowNull: false,
            type: DataTypes.STRING(12),
        },
        id_category: {
            allowNull: false,
            type: DataTypes.STRING(12),
        },
        id_course: {
            allowNull: false,
            type: DataTypes.STRING(12),
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING(30),
        },
        period: {
            allowNull: false,
            type: DataTypes.TIME,
        },
        quantity_question: {
            type: DataTypes.SMALLINT,
        },
        quantity_assignment: {
            type: DataTypes.SMALLINT,
        },
        quantity_download: {
            type: DataTypes.SMALLINT,
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        tableName: 'exam',
        DataTypes,
    },
);
// Course.hasMany(Chapter, { foreignKey: "id_course", as: "chapters", onDelete: "cascade" })
// Chapter.belongsTo(Course, {
//   foreignKey: "id_course"
// });


// Chapter.hasMany(Lecture, { foreignKey: "id_chapter", as: "lectures", onDelete: "cascade" })
// Lecture.belongsTo(Chapter, {
//   foreignKey: "id_chapter"
// });

module.exports = Exam
