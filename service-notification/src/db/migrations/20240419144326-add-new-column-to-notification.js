'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notification', 'id_topic', {
      type: Sequelize.UUID
    });
    await queryInterface.addColumn('notification', 'id_forum', {
      type: Sequelize.UUID
    });
    await queryInterface.addColumn('notification', 'course_name', {
      type: Sequelize.UUID
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notification', 'course_name');
    await queryInterface.removeColumn('notification', 'id_forum');
    await queryInterface.removeColumn('notification', 'id_topic');
  }
};
