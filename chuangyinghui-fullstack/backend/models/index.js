const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

// 导入模型
const User = require('./User')(sequelize, DataTypes);
const CreatorProfile = require('./CreatorProfile')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const Bid = require('./Bid')(sequelize, DataTypes);
const Review = require('./Review')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);
const Portfolio = require('./Portfolio')(sequelize, DataTypes);

// 定义关联关系

// User - CreatorProfile (一对一)
User.hasOne(CreatorProfile, { foreignKey: 'userId', as: 'creatorProfile' });
CreatorProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Order (一对多，作为甲方)
User.hasMany(Order, { foreignKey: 'clientId', as: 'postedOrders' });
Order.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

// User - Order (一对多，作为创作者)
User.hasMany(Order, { foreignKey: 'creatorId', as: 'acceptedOrders' });
Order.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Order - Bid (一对多)
Order.hasMany(Bid, { foreignKey: 'orderId', as: 'bids' });
Bid.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User - Bid (一对多)
User.hasMany(Bid, { foreignKey: 'creatorId', as: 'myBids' });
Bid.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Order - Review (一对多)
Order.hasMany(Review, { foreignKey: 'orderId', as: 'reviews' });
Review.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User - Review (一对多，作为评价者)
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// User - Review (一对多，作为被评价者)
User.hasMany(Review, { foreignKey: 'revieweeId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

// User - Message (一对多，作为发送者)
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// User - Message (一对多，作为接收者)
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// User - Transaction (一对多)
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Portfolio (一对多)
User.hasMany(Portfolio, { foreignKey: 'creatorId', as: 'portfolios' });
Portfolio.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

module.exports = {
  sequelize,
  User,
  CreatorProfile,
  Order,
  Bid,
  Review,
  Message,
  Transaction,
  Portfolio
};
