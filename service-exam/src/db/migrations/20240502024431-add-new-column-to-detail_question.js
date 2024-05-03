'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('detail_question', 'draft', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('assignment', 'draft', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('detail_question', 'status');
    await queryInterface.removeColumn('assignment', 'status');
  }
};
