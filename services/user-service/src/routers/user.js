const express = require('express');
const router = express.Router();

const { getUsers, createUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, getUsers);
router.post('/', createUser);

module.exports = router;