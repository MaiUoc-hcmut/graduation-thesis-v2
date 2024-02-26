'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('course-draft', {
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lecture_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      chapter_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_course: {
        type: Sequelize.UUID,
        allowNull: false,
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
