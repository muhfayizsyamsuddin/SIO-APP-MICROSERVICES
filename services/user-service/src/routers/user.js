const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticate, authenticateInternal, isAdmin } = require('../middleware/auth');

router.get('/profile', authenticate, userController.getMyProfile);
router.get('/admin/users', authenticate, isAdmin, userController.getAdminUsers);
router.get('/', authenticate, userController.getUsers);
router.post('/', userController.createUser);
router.get(
  '/internal/:id/email',
  authenticateInternal,
  userController.getUserEmailInternal
);
router.get('/:id', authenticate, userController.getUserById);

module.exports = router;