'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('exam', 'title', {
      type: Sequelize.STRING(150)
    });
    await queryInterface.addColumn('exam_draft', 'createdAt', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('exam_draft', 'updatedAt', {
      type: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('exam', 'title', {
      type: Sequelize.STRING(150)
    })
  }
};
