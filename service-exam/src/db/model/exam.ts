<<<<<<< HEAD
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Question = require('./question');
=======

const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
>>>>>>> 822c13c1afd439c0fe88306450dd1b91c5c73388

class Exam extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}
<<<<<<< HEAD

Exam.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_course: {
        type: DataTypes.UUID,
    },
    id_category: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    period: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    quantity_question: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    quantity_assignment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize,
    tableName: 'exam',
});

module.exports = Exam;

Exam.belongsToMany(Question, { through: 'exam_question' });
Question.belongsToMany(Exam, { through: 'exam_question' });

Exam.sync();
Question.sync()
=======
Exam.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        last_update_time: DataTypes.TIME,
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        object: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        goal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        knowledge: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'exam',
        sequelize,
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
>>>>>>> 822c13c1afd439c0fe88306450dd1b91c5c73388
