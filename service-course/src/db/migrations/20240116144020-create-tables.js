'use strict';
/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course', {
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
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      object: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      goal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requirement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail: Sequelize.STRING,
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('chapter', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_course: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('lecture', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_chapter: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Chapter',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_video: {
        type: Sequelize.STRING(1000),
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.BIGINT,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('folder', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      parent_folder_id: {
        type: DataTypes.UUID,
      },
      name: {
        type: Sequelize.STRING(100)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('document', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      id_teacher: {
        allowNull: false,
        type: DataTypes.UUID
      },
      parent_folder_id: {
        allowNull: true,
        type: DataTypes.UUID
      },
      name: {
        type: Sequelize.STRING(100)
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      views: {
        defaultValue: 0,
        type: Sequelize.INTEGER.UNSIGNED
      },
      downloads: {
        defaultValue: 0,
        type: Sequelize.INTEGER.UNSIGNED
      },
      createdAt :{
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable('comment', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      id_parent: {
        type: DataTypes.UUID,
        references: {
          model: 'Comment',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_lecture: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Lecture',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(1000),
      },
      image: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('folder', {
      fields: ['parent_folder_id'],
      type: 'foreign key',
      name: 'folders_parent_folder_id_fkey',
      references: {
        table: 'folder',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('document', {
      fields: ['parent_folder_id'],
      type: 'foreign key',
      name: 'documents_parent_folder_id_fkey',
      references: {
        table: 'folder',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('folders', 'folders_parent_folder_id_fkey');
    await queryInterface.removeConstraint('documents', 'documents_parent_folder_id_fkey');
    await queryInterface.dropTable('comment')
    await queryInterface.dropTable('lecture');
    await queryInterface.dropTable('chapter');
    await queryInterface.dropTable('course');
    await queryInterface.dropTable('document');
    await queryInterface.dropTable('folder');
  },
};
