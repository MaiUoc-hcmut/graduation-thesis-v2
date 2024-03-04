'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('course', 'total_chapter', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('course', 'total_duration', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('course', 'average_rating', {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn('course', 'total_review'),
      {
        type: Sequelize.INTEGER,
      };
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('course', 'total_review');
    await queryInterface.removeColumn('course', 'average_rating');
    await queryInterface.removeColumn('course', 'total_duration');
    await queryInterface.removeColumn('course', 'total_chapter');
  },
};
