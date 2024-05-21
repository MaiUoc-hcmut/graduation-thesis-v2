'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('course', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_teacher: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      object: {
        type: Sequelize.STRING(400),
        allowNull: false,
      },
      goal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requirement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail: Sequelize.TEXT,
      cover_image: Sequelize.TEXT,
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_lecture: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_exam: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_chapter: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_review: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      average_rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      registration: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
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
    await queryInterface.createTable('chapter', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_course: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.createTable('topic', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_chapter: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'chapter',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_exam: Sequelize.UUID,
      video: {
        type: Sequelize.TEXT,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      duration: {
        type: Sequelize.BIGINT,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: Sequelize.STRING,
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.createTable('folder', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_teacher: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      parent_folder_id: {
        type: Sequelize.UUID,
        references: {
          model: 'folder',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(100)
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
    await queryInterface.createTable('document', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_teacher: {
        allowNull: false,
        type: Sequelize.UUID
      },
      parent_folder_id: {
        type: Sequelize.UUID,
        references: {
          model: 'folder',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(100)
      },
      url: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      views: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      downloads: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      createdAt :{
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable('comment', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_parent: {
        type: Sequelize.UUID,
        references: {
          model: 'comment',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_topic: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'topic',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_user: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(1000),
      },
      image: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
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
    await queryInterface.createTable('par_category', {
      id: {
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
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_par_category: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'par_category',
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
    await queryInterface.createTable('category-course', {
      id_course: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_category: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'category',
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
    await queryInterface.createTable('review', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
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
          model: 'course',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_exam: {
        type: Sequelize.UUID,
      },
      image: {
        type: Sequelize.TEXT,
      },
      content: {
        type: Sequelize.STRING(1000),
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false
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
    await queryInterface.createTable('course-draft', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      topic_order: {
        type: Sequelize.INTEGER,
      },
      chapter_order: {
        type: Sequelize.INTEGER,
      },
      id_course: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      id_topic: {
        type: Sequelize.UUID
      },
      id_document: {
        type: Sequelize.UUID
      },
      type: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.INTEGER.UNSIGNED
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
    await queryInterface.createTable('course-progress', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_student: Sequelize.UUID,
      id_topic: {
        type: Sequelize.UUID,
        references: {
          model: 'topic',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      }
    });
    await queryInterface.createTable('document-topic', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_document: {
        type: Sequelize.UUID,
        references: {
          model: 'document',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_topic: {
        type: Sequelize.UUID,
        references: {
          model: 'topic',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('forum', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'course',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      total_topic: {
        type: Sequelize.INTEGER
      },
      total_answer: {
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('topicforum', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_forum: {
        type: Sequelize.UUID,
        references: {
          model: 'forum',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_user: {
        type: Sequelize.UUID,
      },
      role: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING(100),
      },
      description: {
        type: Sequelize.TEXT,
      },
      file: {
        type: Sequelize.TEXT
      },
      total_answer: {
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('answer', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_topic_forum: {
        type: Sequelize.UUID,
        references: {
          model: 'topicforum',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_parent: {
        type: Sequelize.UUID,
        references: {
          model: 'answer',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_user: {
        type: Sequelize.UUID
      },
      content: {
        type: Sequelize.STRING(600),
      },
      file: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('student-course', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_student: {
        type: Sequelize.UUID,
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'course',
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
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expire: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('coupon_course', {
      id_coupon: {
        type: Sequelize.UUID,
        references: {
          model: 'coupon',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'course',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('coupon_course');
    await queryInterface.dropTable('coupon');
    await queryInterface.dropTable('student-course');
    await queryInterface.dropTable('answer');
    await queryInterface.dropTable('topicforum');
    await queryInterface.dropTable('forum');
    await queryInterface.dropTable('document-topic');
    await queryInterface.dropTable('course-progress');
    await queryInterface.dropTable('category-course');
    await queryInterface.dropTable('document');
    await queryInterface.dropTable('folder');
    await queryInterface.dropTable('review');
    await queryInterface.dropTable('comment');
    await queryInterface.dropTable('topic');
    await queryInterface.dropTable('chapter');
    await queryInterface.dropTable('course');
    await queryInterface.dropTable('category');
    await queryInterface.dropTable('par_category');
    await queryInterface.dropTable('course-draft');
  }
};
