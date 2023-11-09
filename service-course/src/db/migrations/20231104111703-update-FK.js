'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('folders', {
      fields: ['parent_folder_id'],
      type: 'foreign key',
      name: 'folders_parent_folder_id_fkey',
      references: {
        table: 'folders',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('documents', {
      fields: ['parent_folder_id'],
      type: 'foreign key',
      name: 'documents_parent_folder_id_fkey',
      references: {
        table: 'folders',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('folders', 'folders_parent_folder_id_fkey');
    await queryInterface.removeConstraint('documents', 'documents_parent_folder_id_fkey');
  }
};
