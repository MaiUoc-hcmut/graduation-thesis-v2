'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('transaction_course', 'id_teacher', {
      type: Sequelize.UUID
    });
    await queryInterface.addColumn('transaction_course', 'id_combo_exam', {
      type: Sequelize.UUID
    });
    await queryInterface.addColumn('transaction_course', 'price', {
      type: Sequelize.INTEGER.UNSIGNED
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('transaction_course', 'price');
    await queryInterface.removeColumn('transaction_course', 'id_combo_exam');
    await queryInterface.removeColumn('transaction_course', 'id_teacher');
  }
};
