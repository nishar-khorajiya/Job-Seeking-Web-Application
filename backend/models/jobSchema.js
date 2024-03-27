import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnection.js';
import User from '../models/userSchema.js'

const Job = sequelize.define('Job', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30],
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 500],
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 100],
    },
  },
  fixedSalary: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1000,
      max: 999999999,
    },
  },
  salaryFrom: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1000,
      max: 999999999,
    },
  },
  salaryTo: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1000,
      max: 999999999,
    },
  },
  expired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  jobPostedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

export default Job;
