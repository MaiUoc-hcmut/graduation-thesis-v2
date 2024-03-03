'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('course-progress', 'createdAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('course-progress', 'updatedAt', {
      type: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('course-progress', 'createdAt');
    await queryInterface.removeColumn('course-progress', 'updatedAt');
  }
};
