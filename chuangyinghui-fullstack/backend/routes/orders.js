const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// 创建订单验证规则
const createOrderValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('标题长度必须在5-100个字符之间'),
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('描述至少20个字符'),
  body('category')
    .notEmpty()
    .withMessage('请选择分类'),
  body('budget')
    .isFloat({ min: 0 })
    .withMessage('预算必须大于0'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('工期必须大于0天'),
  body('startTime')
    .notEmpty()
    .withMessage('请选择开始时间')
    .isISO8601()
    .withMessage('开始时间格式不正确'),
  body('endTime')
    .notEmpty()
    .withMessage('请选择结束时间')
    .isISO8601()
    .withMessage('结束时间格式不正确')
    .custom((endTime, { req }) => {
      if (new Date(endTime) <= new Date(req.body.startTime)) {
        throw new Error('结束时间必须晚于开始时间');
      }
      return true;
    })
];

// 更新订单状态验证规则
const updateStatusValidation = [
  body('status')
    .isIn(['open', 'in_progress', 'review', 'revision', 'completed', 'cancelled'])
    .withMessage('无效的状态值')
];

// 公开路由
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

// 需要登录的路由
router.use(authenticate);

router.post('/', createOrderValidation, orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.post('/:id/assign', orderController.assignOrder);
router.put('/:id/status', updateStatusValidation, orderController.updateOrderStatus);

// 我的订单
router.get('/my/orders', orderController.getMyOrders);
router.get('/my/assigned', orderController.getMyAssignedOrders);

module.exports = router;
