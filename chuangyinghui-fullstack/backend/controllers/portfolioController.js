const { Portfolio, User, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取作品集列表
exports.getPortfolios = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      userId,
      category,
      search,
      sort_by = 'createdAt',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (userId) where.userId = userId;
    if (category) where.category = category;

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const order = [[sort_by, sort_order]];

    const { count, rows: portfolios } = await Portfolio.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        portfolios,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取作品集列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取作品集详情
exports.getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await Portfolio.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: '作品不存在'
      });
    }

    res.json({
      success: true,
      data: { portfolio }
    });
  } catch (error) {
    console.error('获取作品集详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 创建作品
exports.createPortfolio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '验证失败',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      category,
      thumbnail,
      videoUrl,
      images,
      tags,
      skills,
      duration,
      clientName,
      projectUrl
    } = req.body;

    // 检查用户是否为创作者
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: '只有创作者可以创建作品集'
      });
    }

    const portfolio = await Portfolio.create({
      userId: req.user.id,
      title,
      description,
      category,
      thumbnail,
      videoUrl,
      images: images || [],
      tags: tags || [],
      skills: skills || [],
      duration,
      clientName,
      projectUrl
    });

    res.status(201).json({
      success: true,
      message: '作品创建成功',
      data: { portfolio }
    });
  } catch (error) {
    console.error('创建作品错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新作品
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const portfolio = await Portfolio.findByPk(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: '作品不存在'
      });
    }

    // 检查权限
    if (portfolio.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此作品'
      });
    }

    await portfolio.update(updateData);

    res.json({
      success: true,
      message: '作品更新成功',
      data: { portfolio }
    });
  } catch (error) {
    console.error('更新作品错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 删除作品
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await Portfolio.findByPk(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: '作品不存在'
      });
    }

    // 检查权限
    if (portfolio.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权删除此作品'
      });
    }

    await portfolio.destroy();

    res.json({
      success: true,
      message: '作品删除成功'
    });
  } catch (error) {
    console.error('删除作品错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取我的作品集
exports.getMyPortfolios = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: portfolios } = await Portfolio.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        portfolios,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取我的作品集错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取作品集统计
exports.getPortfolioStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalCount = await Portfolio.count({
      where: { userId }
    });

    const categoryStats = await Portfolio.findAll({
      where: { userId },
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count']
      ],
      group: ['category']
    });

    res.json({
      success: true,
      data: {
        totalCount,
        categoryStats
      }
    });
  } catch (error) {
    console.error('获取作品集统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
