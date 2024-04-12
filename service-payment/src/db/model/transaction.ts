const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class Transaction extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Transaction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.UUID
    },
    orderId: {
        type: DataTypes.STRING,
    },
    orderType: {
        type: DataTypes.STRING,
    },
    payType: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.NUMBER
    }
}, {
    sequelize,
    tableName: 'transaction'
});



module.exports = Transaction;