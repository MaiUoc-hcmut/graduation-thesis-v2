'use strict';

const { NOW } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('par_category', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('category', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_par_category: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Par_category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('exam', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_teacher: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      id_course: {
        type: Sequelize.UUID,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      period: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      quantity_question: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      quantity_assignment: {
        type: Sequelize.SMALLINT,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('question', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_exam: {
        type: Sequelize.UUID,
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_teacher: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      content_text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      content_image: {
        type: Sequelize.TEXT,
      },
      total_report: {
        type: Sequelize.INTEGER,
      },
      multi_choice: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('save_question', {
      id_student: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      id_question: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('assignment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_student: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      id_exam: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      score: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      time_start: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      time_end: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('answer', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_question: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      content_text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      content_image: {
        type: Sequelize.TEXT,
      },
      is_correct: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('detail_question', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_assignment: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Assignment',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_question: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('q&a', {
      id_student: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      id_question: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      content_text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      content_image: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('error', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(40),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('report_error', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_student: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      id_question: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_error: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Error',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING(90),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('category-exam', {
      id_exam: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_category: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('category-question', {
      id_question: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_category: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('category-exam');
    await queryInterface.dropTable('category-question');
    await queryInterface.dropTable('category');
    await queryInterface.dropTable('par_category');
    await queryInterface.dropTable('detail_question');
    await queryInterface.dropTable('save_question');
    await queryInterface.dropTable('q&a');
    await queryInterface.dropTable('report_error');
    await queryInterface.dropTable('error');
    await queryInterface.dropTable('assignment');
    await queryInterface.dropTable('answer');
    await queryInterface.dropTable('question');
    await queryInterface.dropTable('exam');
  },
};
