const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 验证JWT Token
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 检查用户是否存在且状态正常
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: '账号已被封禁'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '令牌已过期'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的令牌'
      });
    }

    console.error('认证错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// 验证管理员权限
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '需要管理员权限'
    });
  }
  next();
};

// 验证创作者权限
exports.requireCreator = (req, res, next) => {
  if (req.user.role !== 'creator' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '需要创作者权限'
    });
  }
  next();
};

// 验证广告主权限
exports.requireClient = (req, res, next) => {
  if (req.user.role !== 'client' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '需要广告主权限'
    });
  }
  next();
};

// 可选认证（不强制要求登录）
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
