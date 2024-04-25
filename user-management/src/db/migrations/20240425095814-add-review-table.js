'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('teacher', 'total_review', {
      type: Sequelize.INTEGER.UNSIGNED
    });
    await queryInterface.addColumn('teacher', 'average_rating', {
      type: Sequelize.FLOAT
    });
    await queryInterface.addColumn('teacher', 'total_registration', {
      type: Sequelize.INTEGER.UNSIGNED
    });
    await queryInterface.removeColumn('teacher', 'subject');
    await queryInterface.removeColumn('teacher', 'grade');
    await queryInterface.createTable('review', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_student: {
        type: Sequelize.UUID,
        references: {
          model: 'Student',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_teacher: {
        type: Sequelize.UUID,
        references: {
          model: 'Teacher',
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
    await queryInterface.addColumn('teacher', 'grade', {
      type: Sequelize.INTEGER.UNSIGNED,
    });
    await queryInterface.addColumn('teacher', 'subject', {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn('teacher', 'total_registration');
    await queryInterface.removeColumn('teacher', 'average_rating');
    await queryInterface.removeColumn('teacher', 'total_review');
  }
};
