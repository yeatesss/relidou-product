const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// 所有路由都需要管理员权限
router.use(authenticate, requireAdmin);

// 仪表盘统计
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/revenue-trend', adminController.getRevenueTrend);
router.get('/dashboard/user-growth', adminController.getUserGrowthTrend);
router.get('/dashboard/categories', adminController.getCategoryStats);

// 内容审核
router.get('/pending-content', adminController.getPendingContent);
router.put('/reviews/:id/approval', adminController.reviewApproval);
router.put('/creators/:id/verify', adminController.verifyCreator);

// 系统日志
router.get('/logs', adminController.getSystemLogs);

module.exports = router;
