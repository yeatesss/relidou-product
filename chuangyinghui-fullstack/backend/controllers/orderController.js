const { Order, User, CreatorProfile, Bid, Review, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取订单列表
exports.getOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      budget_min, 
      budget_max, 
      status,
      search,
      sort_by = 'createdAt',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    } else {
      // 默认只显示开放中的订单
      where.status = 'open';
    }

    if (budget_min || budget_max) {
      where.budget = {};
      if (budget_min) where.budget[Op.gte] = parseFloat(budget_min);
      if (budget_max) where.budget[Op.lte] = parseFloat(budget_max);
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // 排序
    const order = [[sort_by, sort_order]];

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'username', 'avatar']
      }],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取订单列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取订单详情
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'username', 'avatar', 'email']
        },
        {
          model: User,
          as: 'assignedCreator',
          attributes: ['id', 'username', 'avatar'],
          include: [{
            model: CreatorProfile,
            as: 'creatorProfile'
          }]
        },
        {
          model: Bid,
          as: 'bids',
          include: [{
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'avatar'],
            include: [{
              model: CreatorProfile,
              as: 'creatorProfile'
            }]
          }]
        },
        {
          model: Review,
          as: 'reviews'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('获取订单详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 创建订单
exports.createOrder = async (req, res) => {
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

    const {
      title,
      description,
      category,
      budget,
      duration,
      requirements,
      referenceUrls,
      tags,
      deadline
    } = req.body;

    const order = await Order.create({
      clientId: req.user.id,
      title,
      description,
      category,
      budget,
      duration,
      requirements: requirements || [],
      referenceUrls: referenceUrls || [],
      tags: tags || [],
      deadline: deadline ? new Date(deadline) : null,
      status: 'open'
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: '订单创建成功',
      data: { order }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('创建订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新订单
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    if (order.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此订单'
      });
    }

    // 只能修改开放中的订单
    if (order.status !== 'open' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: '只能修改开放中的订单'
      });
    }

    await order.update(updateData);

    res.json({
      success: true,
      message: '订单更新成功',
      data: { order }
    });
  } catch (error) {
    console.error('更新订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 删除订单
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    if (order.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权删除此订单'
      });
    }

    // 只能删除开放中的订单
    if (order.status !== 'open' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: '只能删除开放中的订单'
      });
    }

    await order.destroy();

    res.json({
      success: true,
      message: '订单删除成功'
    });
  } catch (error) {
    console.error('删除订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 分配订单给创作者
exports.assignOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { creatorId } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    if (order.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权分配此订单'
      });
    }

    // 检查订单状态
    if (order.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: '订单不在可分配状态'
      });
    }

    // 检查创作者是否存在
    const creator = await User.findByPk(creatorId);
    if (!creator || creator.role !== 'creator') {
      return res.status(400).json({
        success: false,
        message: '创作者不存在'
      });
    }

    await order.update({
      assignedCreatorId: creatorId,
      status: 'in_progress',
      assignedAt: new Date()
    });

    res.json({
      success: true,
      message: '订单分配成功',
      data: { order }
    });
  } catch (error) {
    console.error('分配订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新订单状态
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查权限
    const isClient = order.clientId === req.user.id;
    const isCreator = order.assignedCreatorId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '无权更新此订单状态'
      });
    }

    // 状态流转验证
    const validTransitions = {
      'open': ['in_progress', 'cancelled'],
      'in_progress': ['review', 'cancelled'],
      'review': ['completed', 'revision'],
      'revision': ['review'],
      'completed': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态流转'
      });
    }

    const updateData = { status };

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    await order.update(updateData);

    res.json({
      success: true,
      message: '订单状态更新成功',
      data: { order }
    });
  } catch (error) {
    console.error('更新订单状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取我的订单（广告主）
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { clientId: req.user.id };
    if (status) where.status = status;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'assignedCreator',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Bid,
          as: 'bids',
          attributes: ['id']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取我的订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取我接的订单（创作者）
exports.getMyAssignedOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { assignedCreatorId: req.user.id };
    if (status) where.status = status;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取已接订单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
