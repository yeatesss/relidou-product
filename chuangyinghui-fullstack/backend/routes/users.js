const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// 需要登录的路由
router.use(authenticate);

// 当前用户路由
router.get('/dashboard', userController.getDashboard);

// 管理员路由
router.get('/', requireAdmin, userController.getUsers);
router.get('/:id', requireAdmin, userController.getUserById);
router.put('/:id', requireAdmin, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);
router.put('/:id/status', requireAdmin, userController.toggleUserStatus);
router.get('/:id/stats', requireAdmin, userController.getUserStats);

module.exports = router;
