'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('exam_draft', 'type', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('exam_draft', 'id_answer', {
      type: Sequelize.UUID
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('exam_draft', 'type');
    await queryInterface.removeColumn('exam_draft', 'id_answer');
  }
};
