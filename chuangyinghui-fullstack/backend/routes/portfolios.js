const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const portfolioController = require('../controllers/portfolioController');
const { authenticate, requireCreator } = require('../middleware/auth');

// 创建作品验证规则
const createPortfolioValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('标题长度必须在3-100个字符之间'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('描述至少10个字符'),
  body('category')
    .notEmpty()
    .withMessage('请选择分类'),
  body('thumbnail')
    .isURL()
    .withMessage('请提供有效的缩略图URL')
];

// 公开路由
router.get('/', portfolioController.getPortfolios);
router.get('/user/:userId/stats', portfolioController.getPortfolioStats);
router.get('/:id', portfolioController.getPortfolioById);

// 需要登录的路由
router.use(authenticate);

// 创作者专属路由
router.get('/my/portfolios', requireCreator, portfolioController.getMyPortfolios);
router.post('/', requireCreator, createPortfolioValidation, portfolioController.createPortfolio);
router.put('/:id', requireCreator, portfolioController.updatePortfolio);
router.delete('/:id', requireCreator, portfolioController.deletePortfolio);

module.exports = router;
