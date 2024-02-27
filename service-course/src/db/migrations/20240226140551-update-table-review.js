'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('review');
    await queryInterface.createTable('review', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      id_student: {
        type: Sequelize.UUID,
      },
      id_teacher: {
        type: Sequelize.UUID,
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'Course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_exam: {
        type: Sequelize.UUID,
      },
      content: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('review');
  },
};
