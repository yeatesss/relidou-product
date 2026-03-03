const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

// 发送消息验证规则
const sendMessageValidation = [
  body('receiverId')
    .isInt()
    .withMessage('接收者ID无效'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('消息内容长度必须在1-2000个字符之间')
];

// 所有路由都需要登录
router.use(authenticate);

// 消息路由
router.get('/', messageController.getMessages);
router.get('/contacts', messageController.getContacts);
router.get('/unread-count', messageController.getUnreadCount);
router.get('/conversation/:userId', messageController.getConversation);
router.post('/', sendMessageValidation, messageController.sendMessage);
router.put('/:id/read', messageController.markAsRead);
router.put('/read-all', messageController.markAllAsRead);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
