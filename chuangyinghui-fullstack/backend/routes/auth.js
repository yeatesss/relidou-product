const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// 注册验证规则
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少为6个字符'),
  body('role')
    .optional()
    .isIn(['client', 'creator'])
    .withMessage('角色必须是 client 或 creator')
];

// 登录验证规则
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .notEmpty()
    .withMessage('请输入密码')
];

// 修改密码验证规则
const changePasswordValidation = [
  body('oldPassword')
    .notEmpty()
    .withMessage('请输入原密码'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码长度至少为6个字符')
];

// 路由定义
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, authController.changePassword);
router.post('/refresh-token', authenticate, authController.refreshToken);

module.exports = router;
