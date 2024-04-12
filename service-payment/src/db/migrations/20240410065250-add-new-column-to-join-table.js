'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('cart_course', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
    });
    await queryInterface.addColumn('transaction_course', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cart_course', 'id');
    await queryInterface.removeColumn('transaction_course', 'id');
  }
};
