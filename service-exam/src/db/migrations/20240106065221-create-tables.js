'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('par_category', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
    });
    await queryInterface.createTable('category', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_par_category: {
        allowNull: false,
        type: Sequelize.STRING(12),
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
    });
    await queryInterface.createTable('exam', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_teacher: {
        allowNull: false,
        type: Sequelize.STRING(12),
      },
      id_category: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_course: {
        allowNull: false,
        type: Sequelize.STRING(12),
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
      },
      quantity_assignment: {
        type: Sequelize.SMALLINT,
      },
      quantity_download: {
        type: Sequelize.SMALLINT,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
    });
    await queryInterface.createTable('question', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_teacher: {
        allowNull: false,
        type: Sequelize.STRING(12),
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
    });
    await queryInterface.createTable('exam-question', {
      id_exam: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.createTable('save_question', {
      id_exam: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.createTable('assignment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_student: {
        allowNull: false,
        type: Sequelize.STRING(12),
      },
      id_exam: {
        allowNull: false,
        type: Sequelize.STRING(12),
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
    });
    await queryInterface.createTable('detail_question', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_student: {
        allowNull: false,
        type: Sequelize.STRING(12),
      },
      id_assignment: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Assignment',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_exam: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.createTable('answer', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
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
    });
    await queryInterface.createTable('select_answer', {
      id_detail_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Detail_question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_selected_answer: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Answer',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    await queryInterface.createTable('q&a', {
      id_student: {
        allowNull: false,
        type: Sequelize.STRING(12),
      },
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
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
    });
    await queryInterface.createTable('error', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(40),
      },
    });
    await queryInterface.createTable('report_error', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(12),
      },
      id_student: {
        allowNull: false,
        type: Sequelize.STRING(12),
      },
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING(90),
      },
    });
    await queryInterface.createTable('report_error-error', {
      id_error: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Error',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_report_error: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Report_error',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.createTable('category-exam', {
      id_exam: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      id_category: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.createTable('category-question', {
      id_question: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Question',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      id_category: {
        allowNull: false,
        type: Sequelize.STRING(12),
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('select_answer');
    await queryInterface.dropTable('detail_question');
    await queryInterface.dropTable('exam-question');
    await queryInterface.dropTable('save_question');
    await queryInterface.dropTable('answer');
    await queryInterface.dropTable('q&a');
    await queryInterface.dropTable('report_error-error');
    await queryInterface.dropTable('report_error');
    await queryInterface.dropTable('error');
    await queryInterface.dropTable('category-exam');
    await queryInterface.dropTable('category-question');
    await queryInterface.dropTable('assignment');
    await queryInterface.dropTable('exam');
    await queryInterface.dropTable('question');
    await queryInterface.dropTable('category');
    await queryInterface.dropTable('par_category');
  },
};
