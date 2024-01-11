'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('exam', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      id_teacher: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      id_course: {
        type: Sequelize.UUID,
      },
      id_category: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      period: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      quantity_question: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      quantity_assignment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('question', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      id_teacher: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      content_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      total_report: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('assignment', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      id_exam: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'exam',
          key: 'id'
        }
      },
      id_student: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      score: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      time_start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      time_end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('answer', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      id_question: {
        type: Sequelize.UUID,
        references: {
          model: 'question',
          key: 'id',
        }
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      content_text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content_image: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('detail_question', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      id_student: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      id_assignment: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'assignment',
          key: 'id'
        }
      },
      id_exam: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'exam',
          key: 'id'
        }
      },
      id_question: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'question',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('exam_question', {
      id_exam: {
        type: Sequelize.UUID,
        references: {
          model: 'exam',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      id_question: {
        type: Sequelize.UUID,
        references: {
          model: 'question',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('selected_answer', {
      id_detail_question: {
        type: Sequelize.UUID,
        references: {
          model: 'detail_question',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      id_answer: {
        type: Sequelize.UUID,
        references: {
          model: 'answer',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_question');
    await queryInterface.dropTable('selected_answer');
    await queryInterface.dropTable('answer');
    await queryInterface.dropTable('detail_question');
    await queryInterface.dropTable('assignment');
    await queryInterface.dropTable('question');
    await queryInterface.dropTable('exam');
  }
};
