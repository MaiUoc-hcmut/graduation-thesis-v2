
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Chapter = require('./chapter');
const Topic = require('./topic');
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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    goal: {
      type: DataTypes.STRING,
    },
    object: {
      type: DataTypes.STRING,
    },
    requirement: {
      type: DataTypes.STRING,
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


Chapter.hasMany(Topic, { foreignKey: "id_chapter", as: "topics" })
Topic.belongsTo(Chapter, {
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
