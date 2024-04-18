'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notification', 'type', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('notification', 'name', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notification', 'type');
    await queryInterface.removeColumn('notification', 'name');
  }
};
