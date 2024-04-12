'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('cart_course', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
    });
    await queryInterface.addColumn('cart_course', 'createdAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('cart_course', 'updatedAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('transaction_course', 'id', {
      type: Sequelize.UUID,
      primaryKey: true,
    });
    await queryInterface.addColumn('transaction_course', 'createdAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('transaction_course', 'updatedAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('transaction', 'createdAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('transaction', 'updatedAt', {
      type: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cart_course', 'id');
    await queryInterface.removeColumn('cart_course', 'createdAt');
    await queryInterface.removeColumn('cart_course', 'updatedAt');
    await queryInterface.removeColumn('transaction_course', 'id');
    await queryInterface.removeColumn('transaction_course', 'createdAt');
    await queryInterface.removeColumn('transaction_course', 'updatedAt');
  }
};
