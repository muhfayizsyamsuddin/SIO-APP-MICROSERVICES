const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {}

  UserProfile.init(
    {
      photoUrl: DataTypes.STRING,
      address: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserProfile',
    }
  );

  return UserProfile;
};