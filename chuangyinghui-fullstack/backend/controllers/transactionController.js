const { Transaction, Order, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// 获取交易列表
exports.getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      start_date,
      end_date,
      sort_by = 'createdAt',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (type) where.type = type;
    if (status) where.status = status;

    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) where.createdAt[Op.gte] = new Date(start_date);
      if (end_date) where.createdAt[Op.lte] = new Date(end_date);
    }

    // 普通用户只能查看自己的交易
    if (req.user.role !== 'admin') {
      where[Op.or] = [
        { fromUserId: req.user.id },
        { toUserId: req.user.id }
      ];
    }

    const order = [[sort_by, sort_order]];

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'toUser',
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
        transactions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取交易列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取交易详情
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Order,
          as: 'order'
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: '交易不存在'
      });
    }

    // 检查权限
    if (req.user.role !== 'admin' &&
        transaction.fromUserId !== req.user.id &&
        transaction.toUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权查看此交易'
      });
    }

    res.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('获取交易详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 创建交易（管理员）
exports.createTransaction = async (req, res) => {
  const transaction_db = await sequelize.transaction();

  try {
    const {
      orderId,
      fromUserId,
      toUserId,
      type,
      amount,
      description,
      paymentMethod
    } = req.body;

    // 生成交易号
    const transactionNo = `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const transaction = await Transaction.create({
      transactionNo,
      orderId: orderId || null,
      fromUserId,
      toUserId,
      type,
      amount,
      description,
      paymentMethod: paymentMethod || 'platform',
      status: 'pending'
    }, { transaction: transaction_db });

    await transaction_db.commit();

    res.status(201).json({
      success: true,
      message: '交易创建成功',
      data: { transaction }
    });
  } catch (error) {
    await transaction_db.rollback();
    console.error('创建交易错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新交易状态
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: '交易不存在'
      });
    }

    const updateData = { status };

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    await transaction.update(updateData);

    res.json({
      success: true,
      message: '交易状态更新成功',
      data: { transaction }
    });
  } catch (error) {
    console.error('更新交易状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取我的交易
exports.getMyTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { fromUserId: req.user.id },
        { toUserId: req.user.id }
      ]
    };

    if (type) where.type = type;

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取我的交易错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取交易统计
exports.getTransactionStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 总交易额
    const totalAmount = await Transaction.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    // 本月交易额
    const monthlyAmount = await Transaction.sum('amount', {
      where: {
        status: 'completed',
        completedAt: { [Op.gte]: startOfMonth }
      }
    }) || 0;

    // 交易类型分布
    const typeStats = await Transaction.findAll({
      where: { status: 'completed' },
      attributes: [
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    // 交易状态分布
    const statusStats = await Transaction.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    res.json({
      success: true,
      data: {
        totalAmount,
        monthlyAmount,
        typeStats,
        statusStats
      }
    });
  } catch (error) {
    console.error('获取交易统计错误:', error);
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

      const revenue = await Transaction.sum('amount', {
        where: {
          status: 'completed',
          completedAt: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      }) || 0;

      const count = await Transaction.count({
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
        count
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
