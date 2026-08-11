const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const UserProfile = require('./UserProfile')(sequelize, DataTypes);

User.hasOne(UserProfile, {
  foreignKey: 'UserId',
});

UserProfile.belongsTo(User, {
  foreignKey: 'UserId',
});

module.exports = {
  sequelize,
  User,
  UserProfile,
};