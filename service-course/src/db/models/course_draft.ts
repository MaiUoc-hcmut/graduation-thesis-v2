const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class CourseDraft extends Model {}

CourseDraft.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
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
  },
  type: {
    type: DataTypes.STRING(20),
  }
}, {
  sequelize,
  tableName: 'course-draft',
});

module.exports = CourseDraft;