const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

const Transaction = require('./transaction');

class TransactionCourse extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

TransactionCourse.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        primaryKey: true
    },
    id_transaction: {
        type: DataTypes.UUID
    },
    id_course: {
        type: DataTypes.UUID
    }
}, {
    sequelize,
    tableName: 'transaction_course'
});

Transaction.hasMany(TransactionCourse, { foreignKey: 'id_transaction', as: 'courses' });
TransactionCourse.belongsTo(Transaction, { foreignKey: 'id_transaction' });



module.exports = TransactionCourse;