const { User, CreatorProfile, Order, Review, Portfolio, sequelize } = require('../models');
const { Op } = require('sequelize');

// 获取创作者列表
exports.getCreators = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      min_rating,
      max_rating,
      search,
      sort_by = 'rating',
      sort_order = 'DESC',
      is_verified
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const userWhere = { role: 'creator', status: 'active' };
    const profileWhere = {};

    if (search) {
      userWhere[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { '$creatorProfile.bio$': { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      profileWhere.skills = { [Op.like]: `%${category}%` };
    }

    if (min_rating !== undefined || max_rating !== undefined) {
      profileWhere.rating = {};
      if (min_rating !== undefined) profileWhere.rating[Op.gte] = parseFloat(min_rating);
      if (max_rating !== undefined) profileWhere.rating[Op.lte] = parseFloat(max_rating);
    }

    if (is_verified !== undefined) {
      profileWhere.isVerified = is_verified === 'true';
    }

    // 排序
    const order = [];
    if (sort_by === 'rating') {
      order.push(['creatorProfile', 'rating', sort_order]);
    } else if (sort_by === 'completedOrders') {
      order.push(['creatorProfile', 'completedOrders', sort_order]);
    } else if (sort_by === 'createdAt') {
      order.push(['createdAt', sort_order]);
    }

    const { count, rows: creators } = await User.findAndCountAll({
      where: userWhere,
      include: [{
        model: CreatorProfile,
        as: 'creatorProfile',
        where: profileWhere,
        required: true
      }],
      attributes: ['id', 'username', 'avatar', 'createdAt'],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        creators,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取创作者列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取创作者详情
exports.getCreatorById = async (req, res) => {
  try {
    const { id } = req.params;

    const creator = await User.findOne({
      where: { id, role: 'creator' },
      attributes: ['id', 'username', 'avatar', 'createdAt', 'email'],
      include: [
        {
          model: CreatorProfile,
          as: 'creatorProfile'
        },
        {
          model: Portfolio,
          as: 'portfolio',
          limit: 6,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: '创作者不存在'
      });
    }

    // 获取评价
    const reviews = await Review.findAll({
      where: { creatorId: id },
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // 获取完成的订单数
    const completedOrders = await Order.count({
      where: {
        assignedCreatorId: id,
        status: 'completed'
      }
    });

    res.json({
      success: true,
      data: {
        creator: {
          ...creator.toJSON(),
          reviews,
          completedOrders
        }
      }
    });
  } catch (error) {
    console.error('获取创作者详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新创作者资料
exports.updateCreatorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user || user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: '只有创作者可以更新创作者资料'
      });
    }

    const {
      bio,
      skills,
      hourlyRate,
      availability,
      location,
      languages,
      experience,
      education,
      socialLinks
    } = req.body;

    let creatorProfile = await CreatorProfile.findOne({
      where: { userId }
    });

    if (!creatorProfile) {
      creatorProfile = await CreatorProfile.create({
        userId,
        bio: bio || '',
        skills: skills || [],
        hourlyRate: hourlyRate || 0,
        availability: availability || 'full_time',
        location: location || '',
        languages: languages || [],
        experience: experience || [],
        education: education || [],
        socialLinks: socialLinks || {},
        rating: 0,
        reviewCount: 0,
        completedOrders: 0,
        isVerified: false
      });
    } else {
      await creatorProfile.update({
        bio: bio || creatorProfile.bio,
        skills: skills || creatorProfile.skills,
        hourlyRate: hourlyRate || creatorProfile.hourlyRate,
        availability: availability || creatorProfile.availability,
        location: location || creatorProfile.location,
        languages: languages || creatorProfile.languages,
        experience: experience || creatorProfile.experience,
        education: education || creatorProfile.education,
        socialLinks: socialLinks || creatorProfile.socialLinks
      });
    }

    res.json({
      success: true,
      message: '创作者资料更新成功',
      data: { creatorProfile }
    });
  } catch (error) {
    console.error('更新创作者资料错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取创作者统计
exports.getCreatorStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user || user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: '只有创作者可以查看统计数据'
      });
    }

    // 获取总收入
    const totalEarnings = await Order.sum('finalPrice', {
      where: {
        assignedCreatorId: userId,
        status: 'completed'
      }
    }) || 0;

    // 获取本月收入
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyEarnings = await Order.sum('finalPrice', {
      where: {
        assignedCreatorId: userId,
        status: 'completed',
        completedAt: {
          [Op.gte]: currentMonth
        }
      }
    }) || 0;

    // 获取订单统计
    const orderStats = await Order.findAll({
      where: { assignedCreatorId: userId },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status']
    });

    // 获取待处理订单数
    const pendingOrders = await Order.count({
      where: {
        assignedCreatorId: userId,
        status: {
          [Op.in]: ['in_progress', 'review', 'revision']
        }
      }
    });

    // 获取本月完成订单数
    const monthlyCompleted = await Order.count({
      where: {
        assignedCreatorId: userId,
        status: 'completed',
        completedAt: {
          [Op.gte]: currentMonth
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalEarnings,
        monthlyEarnings,
        orderStats,
        pendingOrders,
        monthlyCompleted
      }
    });
  } catch (error) {
    console.error('获取创作者统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取创作者收入趋势
exports.getEarningsTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months = 6 } = req.query;

    const user = await User.findByPk(userId);

    if (!user || user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: '只有创作者可以查看收入趋势'
      });
    }

    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const earnings = await Order.sum('finalPrice', {
        where: {
          assignedCreatorId: userId,
          status: 'completed',
          completedAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      }) || 0;

      const orderCount = await Order.count({
        where: {
          assignedCreatorId: userId,
          status: 'completed',
          completedAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      trends.push({
        month: startOfMonth.toISOString().slice(0, 7),
        earnings,
        orderCount
      });
    }

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    console.error('获取收入趋势错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
