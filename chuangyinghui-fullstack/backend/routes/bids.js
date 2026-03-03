const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bidController = require('../controllers/bidController');
const { authenticate } = require('../middleware/auth');

// 创建投标验证规则
const createBidValidation = [
  body('price')
    .isFloat({ min: 0 })
    .withMessage('报价必须大于0'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('工期必须大于0天'),
  body('proposal')
    .trim()
    .isLength({ min: 20 })
    .withMessage('提案至少20个字符')
];

// 需要登录的路由
router.use(authenticate);

// 获取订单的投标列表
router.get('/order/:orderId', bidController.getBidsByOrder);

// 创建投标
router.post('/order/:orderId', createBidValidation, bidController.createBid);

// 我的投标
router.get('/my/bids', bidController.getMyBids);

// 投标操作
router.put('/:id', bidController.updateBid);
router.put('/:id/cancel', bidController.cancelBid);
router.put('/:id/accept', bidController.acceptBid);
router.put('/:id/reject', bidController.rejectBid);

module.exports = router;
