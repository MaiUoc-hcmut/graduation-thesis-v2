'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('lecture', 'video', {
      type: Sequelize.STRING(2000)
    });
    await queryInterface.changeColumn('course', 'thumbnail', {
      type: Sequelize.STRING(2000)
    });
    await queryInterface.changeColumn('course', 'cover_image', {
      type: Sequelize.STRING(2000)
    });
    await queryInterface.changeColumn('document', 'url', {
      type: Sequelize.STRING(2000)
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
