'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('courses', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   name: {
    //     type: Sequelize.STRING(255),
    //     allowNull: false,
    //   },
    //   description: {
    //     type: Sequelize.STRING,
    //   },
    //   price: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //   },
    //   last_update_time: Sequelize.DATE,
    //   start_time: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   end_time: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   object: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   goal: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   method: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    //   knowledge: Sequelize.STRING,
    //   thumbnail: Sequelize.STRING,
    //   status: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: true,
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    // });
    // await queryInterface.createTable('chapters', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   id_course: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'Courses',
    //       key: 'id',
    //     },
    //   },
    //   name: {
    //     type: Sequelize.STRING(255),
    //     allowNull: false,
    //   },
    //   description: {
    //     type: Sequelize.STRING,
    //   },
    //   order: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //   },
    //   status: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: true,
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    // });
    // await queryInterface.createTable('lectures', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     unique: true,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   id_chapter: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'Chapters',
    //       key: 'id',
    //     },
    //   },
    //   id_video: {
    //     type: Sequelize.STRING,
    //   },
    //   name: {
    //     type: Sequelize.STRING(255),
    //     allowNull: false,
    //   },
    //   description: {
    //     type: Sequelize.STRING,
    //   },
    //   time: {
    //     type: Sequelize.TIME,
    //   },
    //   order: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //   },
    //   status: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: true,
    //   },
    //   createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    //   updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false,
    //   },
    // });
    // await queryInterface.createTable('documents', {
    //   id: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   id_teacher: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     allowNull: false,
    //   },
    //   name: {
    //     type: Sequelize.STRING(100),
    //   },
    //   url: {
    //     type: Sequelize.STRING(),
    //     allowNull: false,
    //   },
    //   views: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     defaultValue: 0,
    //   },
    //   downloads: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     defaultValue: 0,
    //   },
    //   createdAt: Sequelize.DATE,
    //   updatedAt: Sequelize.DATE,
    // });
    // await queryInterface.createTable('categories', {
    //   id: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     autoIncrement: true,
    //     primaryKey: true,
    //   },
    //   name: {
    //     type: Sequelize.STRING(30),
    //     allowNull: false,
    //   },
    //   createdAt: Sequelize.DATE,
    //   updatedAt: Sequelize.DATE,
    // });
    // await queryInterface.createTable('documentcategory', {
    //   documentId: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     allowNull: false,
    //     references: {
    //       model: 'Documents',
    //       key: 'id',
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE',
    //   },
    //   categoryId: {
    //     type: Sequelize.INTEGER.UNSIGNED,
    //     allowNull: false,
    //     references: {
    //       model: 'Categories',
    //       key: 'id',
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE',
    //   },
    //   createdAt: Sequelize.DATE,
    //   updatedAt: Sequelize.DATE,
    // });
    await queryInterface.createTable('documentlecture', {
      documentId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Documents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, //npx sequelize-cli db:migrate --config src/db/config/config.json --migrations-path src/db/migrations
      lectureId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'Lectures',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('lectures');
    // await queryInterface.dropTable('chapters');
    // await queryInterface.dropTable('courses');
    // await queryInterface.dropTable('documents');
    // await queryInterface.dropTable('categories');
    await queryInterface.dropTable('documentlecture');
    // await queryInterface.dropTable('documentcategory');
  },
};
