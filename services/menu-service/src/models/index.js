const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Menu = require('./Menu')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Menu
};