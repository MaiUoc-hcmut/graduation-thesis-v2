'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('exam_draft', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_exam: {
        type: Sequelize.UUID,
      },
      url: {
        type: Sequelize.TEXT,
      },
      order: {
        type: Sequelize.INTEGER
      },
      id_question: {
        type: Sequelize.UUID
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_draft');
  }
};
