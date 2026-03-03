const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

// 创建评价验证规则
const createReviewValidation = [
  body('orderId')
    .isInt()
    .withMessage('订单ID无效'),
  body('creatorId')
    .isInt()
    .withMessage('创作者ID无效'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('评分必须在1-5之间'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('评价内容至少10个字符')
];

// 公开路由
router.get('/', reviewController.getReviews);
router.get('/creator/:creatorId/stats', reviewController.getCreatorReviewStats);
router.get('/:id', reviewController.getReviewById);

// 需要登录的路由
router.use(authenticate);

router.post('/', createReviewValidation, reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
