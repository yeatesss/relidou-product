module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    creatorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100)
    },
    budgetMin: {
      type: DataTypes.DECIMAL(10, 2)
    },
    budgetMax: {
      type: DataTypes.DECIMAL(10, 2)
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2)
    },
    duration: {
      type: DataTypes.STRING(50)
    },
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
    },
    deadline: {
      type: DataTypes.DATE
    },
    location: {
      type: DataTypes.STRING(100),
      defaultValue: '全国'
    },
    requirements: {
      type: DataTypes.TEXT
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pending', 'bidding', 'in_progress', 'review', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bidCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    deliveredAt: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'orders',
    timestamps: true,
    indexes: [
      { fields: ['clientId'] },
      { fields: ['creatorId'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['createdAt'] }
    ]
  });

  return Order;
};
