const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class CourseDraft extends Model {}

CourseDraft.init({
  url: {
    type: DataTypes.TEXT
  },
  lecture_order: {
    type: DataTypes.INTEGER
  },
  chapter_order: {
    type: DataTypes.INTEGER
  },
  id_course: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  }
}, {
  sequelize,
  tableName: 'course-draft',
});

module.exports = CourseDraft;