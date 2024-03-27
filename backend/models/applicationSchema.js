import { DataTypes } from 'sequelize';
import {sequelize} from '../database/dbConnection.js'; 

const Application = sequelize.define('Application', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  coverLetter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resumePublicId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicantId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  employerId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

export default Application;
