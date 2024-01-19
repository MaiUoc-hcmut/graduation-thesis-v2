'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('lecture', 'id_video');
    await queryInterface.addColumn('lecture', 'video', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('lecture', 'id_video', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('lecture', 'video');
  }
};
