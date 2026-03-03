const { Bid, Order, User, CreatorProfile, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 获取订单的投标列表
exports.getBidsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 只有订单发布者或管理员可以查看投标列表
    if (order.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权查看此订单的投标'
      });
    }

    const { count, rows: bids } = await Bid.findAndCountAll({
      where: { orderId },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username', 'avatar'],
        include: [{
          model: CreatorProfile,
          as: 'creatorProfile'
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        bids,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取投标列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 创建投标
exports.createBid = async (req, res) => {
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

    const { orderId } = req.params;
    const { price, duration, proposal, milestones } = req.body;

    // 检查订单是否存在
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 检查订单状态
    if (order.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: '订单不在可投标状态'
      });
    }

    // 不能投标自己的订单
    if (order.clientId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能投标自己的订单'
      });
    }

    // 检查是否已投标
    const existingBid = await Bid.findOne({
      where: {
        orderId,
        creatorId: req.user.id
      }
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: '您已经投标过此订单'
      });
    }

    // 检查用户是否为创作者
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: '只有创作者可以投标'
      });
    }

    const bid = await Bid.create({
      orderId,
      creatorId: req.user.id,
      price,
      duration,
      proposal,
      milestones: milestones || [],
      status: 'pending'
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: '投标成功',
      data: { bid }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('创建投标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新投标
exports.updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, duration, proposal, milestones } = req.body;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: '投标不存在'
      });
    }

    // 检查权限
    if (bid.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权修改此投标'
      });
    }

    // 只能修改待处理的投标
    if (bid.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: '只能修改待处理的投标'
      });
    }

    await bid.update({
      price: price || bid.price,
      duration: duration || bid.duration,
      proposal: proposal || bid.proposal,
      milestones: milestones || bid.milestones
    });

    res.json({
      success: true,
      message: '投标更新成功',
      data: { bid }
    });
  } catch (error) {
    console.error('更新投标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 撤销投标
exports.cancelBid = async (req, res) => {
  try {
    const { id } = req.params;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: '投标不存在'
      });
    }

    // 检查权限
    if (bid.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权撤销此投标'
      });
    }

    // 只能撤销待处理的投标
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '只能撤销待处理的投标'
      });
    }

    await bid.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: '投标已撤销'
    });
  } catch (error) {
    console.error('撤销投标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 接受投标
exports.acceptBid = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const bid = await Bid.findByPk(id, {
      include: [{
        model: Order,
        as: 'order'
      }]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: '投标不存在'
      });
    }

    // 检查权限
    if (bid.order.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权接受此投标'
      });
    }

    // 检查投标状态
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '只能接受待处理的投标'
      });
    }

    // 更新投标状态
    await bid.update({ status: 'accepted' }, { transaction });

    // 更新订单状态
    await bid.order.update({
      assignedCreatorId: bid.creatorId,
      status: 'in_progress',
      assignedAt: new Date(),
      finalPrice: bid.price
    }, { transaction });

    // 拒绝其他投标
    await Bid.update(
      { status: 'rejected' },
      {
        where: {
          orderId: bid.orderId,
          id: { [Op.ne]: id },
          status: 'pending'
        },
        transaction
      }
    );

    await transaction.commit();

    res.json({
      success: true,
      message: '投标已接受，订单已分配',
      data: { bid }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('接受投标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 拒绝投标
exports.rejectBid = async (req, res) => {
  try {
    const { id } = req.params;

    const bid = await Bid.findByPk(id, {
      include: [{
        model: Order,
        as: 'order'
      }]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: '投标不存在'
      });
    }

    // 检查权限
    if (bid.order.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权拒绝此投标'
      });
    }

    // 检查投标状态
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '只能拒绝待处理的投标'
      });
    }

    await bid.update({ status: 'rejected' });

    res.json({
      success: true,
      message: '投标已拒绝'
    });
  } catch (error) {
    console.error('拒绝投标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取我的投标
exports.getMyBids = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { creatorId: req.user.id };
    if (status) where.status = status;

    const { count, rows: bids } = await Bid.findAndCountAll({
      where,
      include: [{
        model: Order,
        as: 'order',
        include: [{
          model: User,
          as: 'client',
          attributes: ['id', 'username', 'avatar']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        bids,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取我的投标错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
