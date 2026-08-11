'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {}

  Menu.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      statusMenu: DataTypes.STRING,
      imageUrl: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Menu'
    }
  );

  return Menu;
};