const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);

module.exports = {
  sequelize,
  User
};