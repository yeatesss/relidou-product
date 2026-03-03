const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, CreatorProfile } = require('../models');
const { validationResult } = require('express-validator');

// 生成JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      username: user.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// 用户注册
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: '验证失败', 
        errors: errors.array() 
      });
    }

    const { username, email, password, role, phone } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'client',
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: 'active'
    });

    // 如果是创作者，创建创作者资料
    if (role === 'creator') {
      await CreatorProfile.create({
        userId: user.id,
        bio: '',
        skills: [],
        portfolio: [],
        rating: 0,
        reviewCount: 0,
        completedOrders: 0,
        isVerified: false
      });
    }

    // 生成token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: '验证失败', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({
      where: { email },
      include: [{
        model: CreatorProfile,
        as: 'creatorProfile',
        required: false
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 检查用户状态
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: '账号已被封禁，请联系客服'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() });

    // 生成token
    const token = generateToken(user);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          creatorProfile: user.creatorProfile
        },
        token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: CreatorProfile,
        as: 'creatorProfile',
        required: false
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const { username, phone, avatar, bio } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 更新用户信息
    await user.update({
      username: username || user.username,
      phone: phone || user.phone,
      avatar: avatar || user.avatar,
      bio: bio || user.bio
    });

    // 如果是创作者，更新创作者资料
    if (user.role === 'creator' && req.body.creatorProfile) {
      const creatorProfile = await CreatorProfile.findOne({
        where: { userId: user.id }
      });

      if (creatorProfile) {
        await creatorProfile.update(req.body.creatorProfile);
      }
    }

    res.json({
      success: true,
      message: '资料更新成功',
      data: {
        user: await User.findByPk(req.user.id, {
          attributes: { exclude: ['password'] },
          include: [{
            model: CreatorProfile,
            as: 'creatorProfile',
            required: false
          }]
        })
      }
    });
  } catch (error) {
    console.error('更新资料错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '原密码错误'
      });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 刷新Token
exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || user.status === 'banned') {
      return res.status(401).json({
        success: false,
        message: 'Token无效'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    console.error('刷新Token错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
