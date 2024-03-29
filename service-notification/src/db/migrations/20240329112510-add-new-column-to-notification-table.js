'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addcolumn('notification', 'read', {
      type: Sequelize.BOOLEAN
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notification', 'read');
  }
};
