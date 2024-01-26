const Sequelize = require('sequelize');
const sequelize = new Sequelize('service_manage_user', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, connect }
