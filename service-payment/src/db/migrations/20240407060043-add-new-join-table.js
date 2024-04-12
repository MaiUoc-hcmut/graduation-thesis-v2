'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cart', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_user: {
        type: Sequelize.UUID
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('transaction', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_user: {
        type: Sequelize.UUID
      },
      orderId: {
        type: Sequelize.STRING
      },
      orderType: {
        type: Sequelize.STRING
      },
      payType: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER.UNSIGNED
      }
    });
    await queryInterface.createTable('transaction_course', {
      id_transaction: {
        type: Sequelize.UUID,
        references: {
          model: 'Transaction',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false
      },
      id_course: {
        type: Sequelize.UUID,
        allowNull: false
      }
    });
    await queryInterface.createTable('cart_course', {
      id_cart: {
        type: Sequelize.UUID,
        references: {
          model: 'Cart',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        allowNull: false
      },
      id_course: {
        type: Sequelize.UUID,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_course');
    await queryInterface.dropTable('transaction_course');
    await queryInterface.dropTable('transaction');
    await queryInterface.dropTable('cart');
  }
};
