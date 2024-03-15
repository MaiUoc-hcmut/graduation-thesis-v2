'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('status', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
    await queryInterface.createTable('knowledge', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
    await queryInterface.createTable('category-knowledge', {
      id_category: {
        type: Sequelize.UUID,
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_knowledge: {
        type: Sequelize.UUID,
        references: {
          model: 'Knowledge',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('knowledge-question', {
      id_knowledge: {
        type: Sequelize.UUID,
        references: {
          model: 'Knowledge',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_question: {
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await queryInterface.addColumn('question', 'status', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('answer', 'status', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('answer', 'status');
    await queryInterface.removeColumn('question', 'status');
    await queryInterface.dropTable('knowledge-question');
    await queryInterface.dropTable('category-knowledge');
    await queryInterface.dropTable('knowledge');
    await queryInterface.dropTable('status');
  }
};
