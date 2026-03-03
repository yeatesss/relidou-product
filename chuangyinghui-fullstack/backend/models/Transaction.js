module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    transactionNumber: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdrawal', 'payment', 'refund', 'fee', 'earning'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500)
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING(50)
    },
    paymentId: {
      type: DataTypes.STRING(255)
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
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['orderId'] },
      { fields: ['type'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  });

  return Transaction;
};
