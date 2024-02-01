'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('comment', 'role', {
      type: Sequelize.STRING,
      defaultValue: "student",
    })
    
  },

  async down (queryInterface, Sequelize) {
    
  }
};
