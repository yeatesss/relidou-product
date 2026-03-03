const { User, CreatorProfile, Order, Bid, Review, Message, sequelize } = require('../models');
const { Op } = require('sequelize');

// 获取用户列表（管理员）
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      search,
      sort_by = 'createdAt',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (role) where.role = role;
    if (status) where.status = status;

    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const order = [[sort_by, sort_order]];

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{
        model: CreatorProfile,
        as: 'creatorProfile',
        required: false
      }],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取用户详情
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
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
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新用户（管理员）
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 不允许通过此接口修改密码
    delete updateData.password;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    await user.update(updateData);

    res.json({
      success: true,
      message: '用户更新成功',
      data: {
        user: await User.findByPk(id, {
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
    console.error('更新用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 不能删除自己
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能删除自己的账号'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 封禁/解封用户
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 不能封禁自己
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能操作自己的账号'
      });
    }

    await user.update({ status });

    res.json({
      success: true,
      message: status === 'banned' ? '用户已封禁' : '用户已解封',
      data: { user }
    });
  } catch (error) {
    console.error('切换用户状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取用户统计
exports.getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    let stats = {};

    if (user.role === 'client') {
      // 广告主统计
      const totalOrders = await Order.count({ where: { clientId: id } });
      const completedOrders = await Order.count({
        where: { clientId: id, status: 'completed' }
      });
      const totalSpent = await Order.sum('finalPrice', {
        where: { clientId: id, status: 'completed' }
      }) || 0;

      stats = {
        totalOrders,
        completedOrders,
        totalSpent,
        activeOrders: totalOrders - completedOrders
      };
    } else if (user.role === 'creator') {
      // 创作者统计
      const totalOrders = await Order.count({
        where: { assignedCreatorId: id }
      });
      const completedOrders = await Order.count({
        where: { assignedCreatorId: id, status: 'completed' }
      });
      const totalEarnings = await Order.sum('finalPrice', {
        where: { assignedCreatorId: id, status: 'completed' }
      }) || 0;

      stats = {
        totalOrders,
        completedOrders,
        totalEarnings,
        activeOrders: totalOrders - completedOrders
      };
    }

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('获取用户统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取当前用户仪表盘数据
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    let dashboard = {};

    if (user.role === 'client') {
      // 广告主仪表盘
      const totalOrders = await Order.count({ where: { clientId: userId } });
      const activeOrders = await Order.count({
        where: {
          clientId: userId,
          status: {
            [Op.in]: ['open', 'in_progress', 'review', 'revision']
          }
        }
      });
      const completedOrders = await Order.count({
        where: { clientId: userId, status: 'completed' }
      });
      const totalSpent = await Order.sum('finalPrice', {
        where: { clientId: userId, status: 'completed' }
      }) || 0;

      // 最近订单
      const recentOrders = await Order.findAll({
        where: { clientId: userId },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{
          model: User,
          as: 'assignedCreator',
          attributes: ['id', 'username', 'avatar']
        }]
      });

      // 待处理消息
      const unreadMessages = await Message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      });

      dashboard = {
        stats: {
          totalOrders,
          activeOrders,
          completedOrders,
          totalSpent,
          unreadMessages
        },
        recentOrders
      };
    } else if (user.role === 'creator') {
      // 创作者仪表盘
      const totalOrders = await Order.count({
        where: { assignedCreatorId: userId }
      });
      const activeOrders = await Order.count({
        where: {
          assignedCreatorId: userId,
          status: {
            [Op.in]: ['in_progress', 'review', 'revision']
          }
        }
      });
      const completedOrders = await Order.count({
        where: { assignedCreatorId: userId, status: 'completed' }
      });
      const totalEarnings = await Order.sum('finalPrice', {
        where: { assignedCreatorId: userId, status: 'completed' }
      }) || 0;

      // 最近订单
      const recentOrders = await Order.findAll({
        where: { assignedCreatorId: userId },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [{
          model: User,
          as: 'client',
          attributes: ['id', 'username', 'avatar']
        }]
      });

      // 待处理消息
      const unreadMessages = await Message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      });

      // 我的投标
      const myBids = await Bid.count({
        where: { creatorId: userId }
      });

      dashboard = {
        stats: {
          totalOrders,
          activeOrders,
          completedOrders,
          totalEarnings,
          unreadMessages,
          myBids
        },
        recentOrders
      };
    }

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('获取仪表盘数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
