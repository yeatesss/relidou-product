const express = require('express');
const router = express.Router();

// 导入路由模块
const authRoutes = require('./auth');
const userRoutes = require('./users');
const orderRoutes = require('./orders');
const bidRoutes = require('./bids');
const creatorRoutes = require('./creators');
const reviewRoutes = require('./reviews');
const messageRoutes = require('./messages');
const transactionRoutes = require('./transactions');
const portfolioRoutes = require('./portfolios');
const adminRoutes = require('./admin');

// 注册路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/bids', bidRoutes);
router.use('/creators', creatorRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/transactions', transactionRoutes);
router.use('/portfolios', portfolioRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
