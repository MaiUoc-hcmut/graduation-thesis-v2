
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Chapter = require('./chapter');
const Lecture = require('./lecture');
const Category = require('./category');

class Course extends Model {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_teacher: {
      type: DataTypes.UUID,
      allowNull: false,
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
    goal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    object: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: DataTypes.STRING,
    cover_image: DataTypes.STRING,
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
    tableName: 'course',
    sequelize,
  },
);
Course.hasMany(Chapter, { foreignKey: "id_course", as: "chapters" })
Chapter.belongsTo(Course, {
  foreignKey: "id_course",
});


Chapter.hasMany(Lecture, { foreignKey: "id_chapter", as: "lectures" })
Lecture.belongsTo(Chapter, {
  foreignKey: "id_chapter"
});

Course.belongsToMany(Category, { 
  through: 'category-course',
  foreignKey: 'id_course',
  otherKey: 'id_category'
});
Category.belongsToMany(Course, { 
  through: 'categoty-course',
  foreignKey: 'category',
  otherKey: 'id_course'
});

module.exports = Course
