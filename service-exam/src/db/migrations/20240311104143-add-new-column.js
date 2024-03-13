'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('exam', 'pass_score', {
      type: Sequelize.FLOAT,
    });
    await queryInterface.changeColumn('exam', 'period', {
      type: Sequelize.INTEGER
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('exam', 'pass_score');
    await queryInterface.changeColumn('exam', 'period', {
      type: Sequelize.TIME
    });
  }
};
