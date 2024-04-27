'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notification', 'id_exam', {
      type: Sequelize.UUID
    });
    await queryInterface.addColumn('notification', 'id_assignment', {
      type: Sequelize.UUID
    });
    await queryInterface.addColumn('notification', 'exam_name', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notification', 'exam_name');
    await queryInterface.removeColumn('notification', 'id_assignment');
    await queryInterface.removeColumn('notification', 'id_exam');
  }
};
