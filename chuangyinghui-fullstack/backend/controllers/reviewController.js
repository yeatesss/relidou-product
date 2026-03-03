const { Review, Order, User, CreatorProfile, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取评价列表
exports.getReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      creatorId,
      clientId,
      status,
      min_rating,
      max_rating,
      sort_by = 'createdAt',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (creatorId) where.creatorId = creatorId;
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    if (min_rating !== undefined || max_rating !== undefined) {
      where.rating = {};
      if (min_rating !== undefined) where.rating[Op.gte] = parseFloat(min_rating);
      if (max_rating !== undefined) where.rating[Op.lte] = parseFloat(max_rating);
    }

    const order = [[sort_by, sort_order]];

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
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
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'title']
        }
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取评价列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取评价详情
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
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
        },
        {
          model: Order,
          as: 'order'
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: '评价不存在'
      });
    }

    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    console.error('获取评价详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 创建评价
exports.createReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '验证失败',
        errors: errors.array()
      });
    }

    const { orderId, creatorId, rating, content, tags } = req.body;

    // 检查订单是否存在
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查订单状态
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '只能评价已完成的订单'
      });
    }

    // 检查是否是订单发布者
    if (order.clientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权评价此订单'
      });
    }

    // 检查是否已评价
    const existingReview = await Review.findOne({
      where: {
        orderId,
        clientId: req.user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: '您已经评价过此订单'
      });
    }

    const review = await Review.create({
      orderId,
      clientId: req.user.id,
      creatorId,
      rating,
      content,
      tags: tags || [],
      status: 'pending'
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: '评价提交成功，等待审核',
      data: { review }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('创建评价错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新评价
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, tags } = req.body;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: '评价不存在'
      });
    }

    // 检查权限
    if (review.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此评价'
      });
    }

    await review.update({
      rating: rating || review.rating,
      content: content || review.content,
      tags: tags || review.tags,
      status: req.user.role === 'admin' ? review.status : 'pending'
    });

    res.json({
      success: true,
      message: '评价更新成功',
      data: { review }
    });
  } catch (error) {
    console.error('更新评价错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 删除评价
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: '评价不存在'
      });
    }

    // 检查权限
    if (review.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权删除此评价'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: '评价删除成功'
    });
  } catch (error) {
    console.error('删除评价错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取创作者的评价统计
exports.getCreatorReviewStats = async (req, res) => {
  try {
    const { creatorId } = req.params;

    // 检查创作者是否存在
    const creator = await User.findOne({
      where: { id: creatorId, role: 'creator' }
    });

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: '创作者不存在'
      });
    }

    // 获取评分分布
    const ratingDistribution = await Review.findAll({
      where: {
        creatorId,
        status: 'approved'
      },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'DESC']]
    });

    // 获取评价标签统计
    const tagStats = await Review.findAll({
      where: {
        creatorId,
        status: 'approved'
      },
      attributes: ['tags']
    });

    const tagCounts = {};
    tagStats.forEach(review => {
      review.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // 获取最近评价
    const recentReviews = await Review.findAll({
      where: {
        creatorId,
        status: 'approved'
      },
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        ratingDistribution,
        tagCounts,
        recentReviews
      }
    });
  } catch (error) {
    console.error('获取创作者评价统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
