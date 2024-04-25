'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('exam', 'total_review', {
      type: Sequelize.INTEGER.UNSIGNED
    });
    await queryInterface.addColumn('exam', 'average_rating', {
      type: Sequelize.FLOAT
    });
    await queryInterface.createTable('review', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_student: {
        type: Sequelize.UUID
      },
      id_exam: {
        type: Sequelize.UUID,
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      content: {
        type: Sequelize.STRING(1000)
      },
      image: {
        type: Sequelize.TEXT
      },
      rating: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('review');
    await queryInterface.removeColumn('exam', 'average_rating');
    await queryInterface.removeColumn('exam', 'total_review');
  }
};
