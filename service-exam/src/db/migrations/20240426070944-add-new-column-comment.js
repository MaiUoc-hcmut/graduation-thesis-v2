'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('detail_question', 'comment', {
      type: Sequelize.STRING(300)
    });
    await queryInterface.addColumn('assignment', 'comment', {
      type: Sequelize.STRING(300)
    });
    await queryInterface.addColumn('assignment', 'reviewed', {
      type: Sequelize.INTEGER.UNSIGNED
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('detail_question', 'comment');
    await queryInterface.removeColumn('assignment', 'comment');
    await queryInterface.removeColumn('assignment', 'reviewed');
  }
};
