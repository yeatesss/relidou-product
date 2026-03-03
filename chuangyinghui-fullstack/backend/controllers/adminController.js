const { User, Order, CreatorProfile, Review, Bid, sequelize } = require('../models');
const { Op } = require('sequelize');

// 获取仪表盘统计数据
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 用户统计
    const totalUsers = await User.count();
    const newUsersThisMonth = await User.count({
      where: { createdAt: { [Op.gte]: startOfMonth } }
    });
    const newUsersLastMonth = await User.count({
      where: {
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
        }
      }
    });

    // 创作者统计
    const totalCreators = await User.count({ where: { role: 'creator' } });
    const verifiedCreators = await CreatorProfile.count({
      where: { isVerified: true }
    });

    // 订单统计
    const totalOrders = await Order.count();
    const ordersThisMonth = await Order.count({
      where: { createdAt: { [Op.gte]: startOfMonth } }
    });
    const ordersLastMonth = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
        }
      }
    });

    // 订单状态分布
    const orderStatusStats = await Order.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status']
    });

    // 收入统计
    const totalRevenue = await Order.sum('finalPrice', {
      where: { status: 'completed' }
    }) || 0;

    const revenueThisMonth = await Order.sum('finalPrice', {
      where: {
        status: 'completed',
        completedAt: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    const revenueLastMonth = await Order.sum('finalPrice', {
      where: {
        status: 'completed',
        completedAt: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
        }
      }
    }) || 0;

    // 待处理事项
    const pendingReviews = await Review.count({
      where: { status: 'pending' }
    });

    const pendingVerifications = await CreatorProfile.count({
      where: { isVerified: false }
    });

    const openOrders = await Order.count({
      where: { status: 'open' }
    });

    // 计算增长率
    const userGrowth = newUsersLastMonth > 0
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
      : 100;

    const orderGrowth = ordersLastMonth > 0
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
      : 100;

    const revenueGrowth = revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
      : 100;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsersThisMonth,
          userGrowth: parseFloat(userGrowth),
          totalCreators,
          verifiedCreators,
          totalOrders,
          ordersThisMonth,
          orderGrowth: parseFloat(orderGrowth),
          totalRevenue,
          revenueThisMonth,
          revenueGrowth: parseFloat(revenueGrowth)
        },
        orderStatus: orderStatusStats,
        pending: {
          reviews: pendingReviews,
          verifications: pendingVerifications,
          openOrders
        }
      }
    });
  } catch (error) {
    console.error('获取仪表盘统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取收入趋势
exports.getRevenueTrend = async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const revenue = await Order.sum('finalPrice', {
        where: {
          status: 'completed',
          completedAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      }) || 0;

      const orderCount = await Order.count({
        where: {
          status: 'completed',
          completedAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      trends.push({
        month: startOfMonth.toISOString().slice(0, 7),
        revenue,
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

// 获取用户增长趋势
exports.getUserGrowthTrend = async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const newUsers = await User.count({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      const newCreators = await User.count({
        where: {
          role: 'creator',
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      });

      trends.push({
        month: startOfMonth.toISOString().slice(0, 7),
        newUsers,
        newCreators
      });
    }

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    console.error('获取用户增长趋势错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取热门分类统计
exports.getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Order.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'orderCount'],
        [sequelize.fn('SUM', sequelize.col('finalPrice')), 'totalRevenue']
      ],
      where: { status: 'completed' },
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('category')), 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: { categories: categoryStats }
    });
  } catch (error) {
    console.error('获取分类统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取待审核内容
exports.getPendingContent = async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let results = {};

    if (type === 'all' || type === 'reviews') {
      const { count, rows: reviews } = await Review.findAndCountAll({
        where: { status: 'pending' },
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'username', 'avatar']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      results.reviews = {
        items: reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    }

    if (type === 'all' || type === 'verifications') {
      const { count, rows: verifications } = await CreatorProfile.findAndCountAll({
        where: { isVerified: false },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar', 'email', 'createdAt']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      results.verifications = {
        items: verifications,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('获取待审核内容错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 审核评价
exports.reviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: '评价不存在'
      });
    }

    await review.update({
      status,
      moderatedBy: req.user.id,
      moderatedAt: new Date(),
      moderationReason: reason
    });

    // 如果通过审核，更新创作者评分
    if (status === 'approved') {
      const creatorProfile = await CreatorProfile.findOne({
        where: { userId: review.creatorId }
      });

      if (creatorProfile) {
        const allReviews = await Review.findAll({
          where: {
            creatorId: review.creatorId,
            status: 'approved'
          }
        });

        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / allReviews.length;

        await creatorProfile.update({
          rating: parseFloat(averageRating.toFixed(1)),
          reviewCount: allReviews.length
        });
      }
    }

    res.json({
      success: true,
      message: status === 'approved' ? '评价已通过审核' : '评价已拒绝',
      data: { review }
    });
  } catch (error) {
    console.error('审核评价错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 审核创作者认证
exports.verifyCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, reason } = req.body;

    const creatorProfile = await CreatorProfile.findByPk(id);

    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: '创作者资料不存在'
      });
    }

    await creatorProfile.update({
      isVerified,
      verifiedAt: isVerified ? new Date() : null,
      verifiedBy: isVerified ? req.user.id : null,
      verificationNote: reason
    });

    res.json({
      success: true,
      message: isVerified ? '创作者已认证' : '创作者认证已取消',
      data: { creatorProfile }
    });
  } catch (error) {
    console.error('审核创作者认证错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取系统日志（模拟）
exports.getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;

    // 这里应该连接实际的日志系统
    // 现在返回模拟数据
    const mockLogs = [
      {
        id: 1,
        type: 'info',
        message: '系统启动成功',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        type: 'warning',
        message: '数据库连接池接近上限',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        type: 'error',
        message: '邮件服务连接失败',
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: {
        logs: mockLogs,
        pagination: {
          total: 100,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 2
        }
      }
    });
  } catch (error) {
    console.error('获取系统日志错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
