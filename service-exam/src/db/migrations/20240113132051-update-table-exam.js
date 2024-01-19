'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('exam', 'id_category');
    await queryInterface.removeColumn('exam', 'quantity_download');

    await queryInterface.addColumn('exam', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });

    await queryInterface.addColumn('exam', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('exam', 'id_category', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('exam', 'quantity_download', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.removeColumn('exam', 'createdAt');
    await queryInterface.removeColumn('exam', 'updatedAt');
  }
};
