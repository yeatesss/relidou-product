const express = require('express');
const router = express.Router();
const creatorController = require('../controllers/creatorController');
const { authenticate, requireCreator } = require('../middleware/auth');

// 公开路由
router.get('/', creatorController.getCreators);
router.get('/:id', creatorController.getCreatorById);

// 需要登录的路由
router.use(authenticate);

// 创作者专属路由
router.put('/profile', requireCreator, creatorController.updateCreatorProfile);
router.get('/stats/overview', requireCreator, creatorController.getCreatorStats);
router.get('/stats/earnings', requireCreator, creatorController.getEarningsTrend);

module.exports = router;
