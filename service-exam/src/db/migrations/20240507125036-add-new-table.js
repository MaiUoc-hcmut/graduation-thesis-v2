'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('combo', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_teacher: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      description: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.TEXT
      },
      cover: {
        type: Sequelize.TEXT
      },
      average_rating: {
        type: Sequelize.FLOAT
      },
      total_review: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      total_registration: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('combo_exam', {
      id_combo: {
        type: Sequelize.UUID,
        references: {
          model: 'Combo',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_exam: {
        type: Sequelize.UUID,
        references: {
          model: 'Exam',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('coupon', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_teacher: {
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING
      },
      percent: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      expire: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('coupon_exam', {
      id_coupon: {
        type: Sequelize.UUID,
        references: {
          model: 'Coupon',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_exan: {
        type: Sequelize.UUID,
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('student_combo', {
      id_student: {
        type: Sequelize.UUID
      },
      id_combo: {
        type: Sequelize.UUID,
        references: {
          model: 'Combo',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student_combo');
    await queryInterface.dropTable('coupon_exam');
    await queryInterface.dropTable('coupon');
    await queryInterface.dropTable('combo_exam');
    await queryInterface.dropTable('combo');
  }
};
