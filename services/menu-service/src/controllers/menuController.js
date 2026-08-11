const { Op } = require('sequelize');
const { Menu } = require('../models');

class MenuController {
  static async getMenus(req, res) {
    try {
      const { search } = req.query;

      const where = {
        statusMenu: 'Tersedia'
      };

      if (search) {
        where.name = {
          [Op.iLike]: `%${search}%`
        };
      }

      const menus = await Menu.findAll({
        where,
        order: [['name', 'ASC']]
      });

      res.json(menus);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Failed to get menus'
      });
    }
  }
}

module.exports = MenuController;