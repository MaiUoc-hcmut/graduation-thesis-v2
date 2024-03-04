'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('document-topic', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_document: {
        type: Sequelize.UUID,
        references: {
          model: 'Document',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_topic: {
        type: Sequelize.UUID,
        references: {
          model: 'Topic',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn('course-draft', 'id_document', {
      type: Sequelize.UUID
    });
    await queryInterface.removeColumn('topic', 'document_url');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('topic', 'document_url', {
      type: Sequelize.TEXT
    })
    await queryInterface.removeColumn('course-draft', 'id_document');
    await queryInterface.dropTable('document-topic');
  }
};
