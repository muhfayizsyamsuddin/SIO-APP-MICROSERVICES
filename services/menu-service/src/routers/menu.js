const express = require('express');
const router = express.Router();

const MenuController = require('../controllers/menuController');

router.get('/', MenuController.getMenus);
router.get('/:id', MenuController.getMenuById);

module.exports = router;