const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// 需要登录的路由
router.use(authenticate);

// 我的交易
router.get('/my', transactionController.getMyTransactions);

// 管理员路由
router.get('/', requireAdmin, transactionController.getTransactions);
router.get('/stats/overview', requireAdmin, transactionController.getTransactionStats);
router.get('/stats/trend', requireAdmin, transactionController.getRevenueTrend);
router.get('/:id', transactionController.getTransactionById);
router.post('/', requireAdmin, transactionController.createTransaction);
router.put('/:id/status', requireAdmin, transactionController.updateTransactionStatus);

module.exports = router;
