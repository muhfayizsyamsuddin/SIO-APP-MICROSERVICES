const express = require('express');
const router = express.Router();

const { getUsers, createUser, getUserById } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, getUsers);
router.post('/', createUser);
router.get('/:id', authenticate, getUserById);

module.exports = router;