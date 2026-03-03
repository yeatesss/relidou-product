module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING(50)
    },
    message: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    },
    isWithdrawn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    tableName: 'bids',
    timestamps: true,
    indexes: [
      { fields: ['orderId'] },
      { fields: ['creatorId'] },
      { fields: ['status'] }
    ]
  });

  return Bid;
};
