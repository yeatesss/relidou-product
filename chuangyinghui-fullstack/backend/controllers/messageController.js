const { Message, User, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

// 获取消息列表
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, orderId } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { senderId: req.user.id },
        { receiverId: req.user.id }
      ]
    };

    if (userId) {
      where[Op.and] = [
        {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      ];
    }

    if (orderId) {
      where.orderId = orderId;
    }

    const { count, rows: messages } = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
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
        messages,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取消息列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取与特定用户的对话
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: messages } = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          {
            senderId: req.user.id,
            receiverId: userId
          },
          {
            senderId: userId,
            receiverId: req.user.id
          }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 标记消息为已读
    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: userId,
          receiverId: req.user.id,
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取对话错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 发送消息
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, orderId, attachments } = req.body;

    // 检查接收者是否存在
    const receiver = await User.findByPk(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: '接收者不存在'
      });
    }

    // 不能给自己发消息
    if (parseInt(receiverId) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能给自己发送消息'
      });
    }

    // 如果指定了订单，检查订单是否存在
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      // 检查是否是订单相关方
      if (order.clientId !== req.user.id &&
          order.assignedCreatorId !== req.user.id &&
          req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: '无权在此订单下发送消息'
        });
      }
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      orderId: orderId || null,
      content,
      attachments: attachments || [],
      isRead: false
    });

    const messageWithUsers = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: '消息发送成功',
      data: { message: messageWithUsers }
    });
  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 标记消息为已读
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      });
    }

    // 检查权限
    if (message.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权操作此消息'
      });
    }

    await message.update({ isRead: true });

    res.json({
      success: true,
      message: '消息已标记为已读'
    });
  } catch (error) {
    console.error('标记消息已读错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 标记所有消息为已读
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.query;

    const where = {
      receiverId: req.user.id,
      isRead: false
    };

    if (userId) {
      where.senderId = userId;
    }

    await Message.update(
      { isRead: true },
      { where }
    );

    res.json({
      success: true,
      message: '所有消息已标记为已读'
    });
  } catch (error) {
    console.error('标记所有消息已读错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 删除消息
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: '消息不存在'
      });
    }

    // 检查权限
    if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此消息'
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: '消息删除成功'
    });
  } catch (error) {
    console.error('删除消息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取未读消息数
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({
      where: {
        receiverId: req.user.id,
        isRead: false
      }
    });

    // 按发送者分组统计
    const unreadBySender = await Message.findAll({
      where: {
        receiverId: req.user.id,
        isRead: false
      },
      attributes: [
        'senderId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['senderId'],
      include: [{
        model: User,
        as: 'sender',
        attributes: ['username', 'avatar']
      }]
    });

    res.json({
      success: true,
      data: {
        total: count,
        bySender: unreadBySender
      }
    });
  } catch (error) {
    console.error('获取未读消息数错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取联系人列表
exports.getContacts = async (req, res) => {
  try {
    // 获取所有有过消息往来的用户
    const contacts = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      attributes: [
        [sequelize.fn('MAX', sequelize.col('Message.createdAt')), 'lastMessageAt']
      ],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar'],
          where: {
            id: {
              [Op.ne]: req.user.id
            }
          },
          required: false
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar'],
          where: {
            id: {
              [Op.ne]: req.user.id
            }
          },
          required: false
        }
      ],
      group: [
        sequelize.literal(`
          CASE 
            WHEN senderId = ${req.user.id} THEN receiverId 
            ELSE senderId 
          END
        `)
      ],
      order: [[sequelize.fn('MAX', sequelize.col('Message.createdAt')), 'DESC']]
    });

    // 格式化联系人数据
    const formattedContacts = contacts.map(contact => {
      const otherUser = contact.sender || contact.receiver;
      return {
        user: otherUser,
        lastMessageAt: contact.get('lastMessageAt')
      };
    });

    res.json({
      success: true,
      data: { contacts: formattedContacts }
    });
  } catch (error) {
    console.error('获取联系人列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};
