
const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class Teacher extends Model {
  declare id: number;
  declare name: string;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(10),
      validate: {
        len: [10, 10],
      }
    },
    address: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING(10),
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 10,
        max: 12,
      },
    },
    subject: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    biostory: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: 'Teacher',
    sequelize,
  },
);

module.exports = Teacher
