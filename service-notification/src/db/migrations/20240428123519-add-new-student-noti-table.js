'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('student-noti', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_student: {
        type: Sequelize.UUID,
      },
      id_notification: {
        type: Sequelize.UUID,
        references: {
          model: 'Notification',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student-noti');
  }
};
