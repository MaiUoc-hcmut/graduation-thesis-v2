const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('service_exam', 'root', '0974222365', {
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
const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('service-exam', 'root', '0974222365', {
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
