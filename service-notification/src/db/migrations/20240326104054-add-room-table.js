'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('room_socket', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_user: {
        type: Sequelize.UUID
      },
      room: {
        type: Sequelize.STRING
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('room_socket');
  }
};
