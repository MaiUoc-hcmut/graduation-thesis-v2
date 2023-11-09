'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      id_teacher: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      parent_folder_id: {
        allowNull: true,
        type: Sequelize.INTEGER.UNSIGNED
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
      }
    });
    await queryInterface.createTable('folders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      parent_folder_id: {
        type: Sequelize.INTEGER.UNSIGNED,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documents');
    await queryInterface.dropTable('folders');
  },
};
