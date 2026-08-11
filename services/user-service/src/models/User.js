const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Username is required!'
          },
          isLowercase: {
            msg: 'Username must be lowercase!'
          }
        }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email must be unique'
        },
        validate: {
          notEmpty: {
            msg: 'Email is required!'
          },
          isEmail: {
            msg: 'Email must be valid!'
          }
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password is required!'
          }
        }
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Role is required!'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        async beforeCreate(user) {
          const salt = await bcrypt.genSalt(8);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  );

  return User;
};