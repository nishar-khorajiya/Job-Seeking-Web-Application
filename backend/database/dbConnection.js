import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
});

export { sequelize };

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Models synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error synchronizing models:', err);
  });