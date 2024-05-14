'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notification', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_user: {
        type: Sequelize.UUID
      },
      content: {
        type: Sequelize.STRING
      },
      createdAt: Sequelize.DATE,
      updatedAT: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('notification');
  }
};
