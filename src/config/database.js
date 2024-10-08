const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('product_inv', 'root', 'A@123456', {
  host: 'localhost',
  dialect: 'mysql'
});


const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


const sync = async () => {
  await sequelize.sync();
  console.log('All models were synchronized successfully.');
};


module.exports = { sequelize, connectDatabase, sync };
