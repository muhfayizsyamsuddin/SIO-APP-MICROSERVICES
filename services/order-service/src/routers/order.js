const express = require('express');
const OrderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin', authenticate, isAdmin, OrderController.getAdminOrders);

router.get('/', OrderController.getOrders);
router.post('/:menuId', OrderController.postOrder);
router.post('/:menuId/edit', OrderController.handlerEdit);
router.post('/:menuId/delete', OrderController.handlerDelete);
router.post('/:orderId/pay', OrderController.payOrder);
router.get('/:orderId/pdf', OrderController.downloadPdf);

module.exports = router;