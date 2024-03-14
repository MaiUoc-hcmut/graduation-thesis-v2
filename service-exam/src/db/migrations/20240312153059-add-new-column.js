'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('exam', 'period', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('assignment', 'passed', {
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn('assignment', 'right_question', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('assignment', 'wrong_question', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('assignment', 'empty_question', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.createTable('selected_answer', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_detail_question: {
        type: Sequelize.UUID,
        references: {
          model: 'Detail_Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_answer: {
        type: Sequelize.UUID,
        references: {
          model: 'Answer',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      is_selected: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('exam', 'period', {
      type: Sequelize.TIME,
    });
    await queryInterface.removeColumn('assignment', 'right_question');
    await queryInterface.removeColumn('assignment', 'wrong_question');
    await queryInterface.removeColumn('assignment', 'empty_question');
    await queryInterface.removeColumn('assignment', 'passed');
    await queryInterface.dropTable('selected_answer');
  },
};
