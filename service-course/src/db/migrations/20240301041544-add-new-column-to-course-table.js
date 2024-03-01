'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('course', 'total_lecture', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('course', 'total_exam', {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('course', 'total_exam');
    await queryInterface.removeColumn('course', 'total_lecture');
  }
};
