'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('review', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
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
          key: 'id'
        }
      },
      id_exam: {
        type: Sequelize.UUID,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('review');
  }
};
