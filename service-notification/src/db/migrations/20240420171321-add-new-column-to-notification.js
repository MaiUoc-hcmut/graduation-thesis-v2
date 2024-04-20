'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notification', 'id_course', {
      type: Sequelize.UUID
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notification', 'id_course');
  }
};
