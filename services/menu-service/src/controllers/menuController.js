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

  static async getMenuById(req, res) {
    try {
        const { id } = req.params;

        const menu = await Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({
                message: 'Menu tidak ditemukan'
            });
        }

        res.json(menu);
    } catch (error) {
        console.log(error, '<== error get menu by id');

        res.status(500).json({
            message: 'Internal server error'
        });
    }
    }
}

module.exports = MenuController;