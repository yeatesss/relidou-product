module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(500),
      defaultValue: null
    },
    userType: {
      type: DataTypes.ENUM('client', 'creator', 'admin'),
      defaultValue: 'client'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'pending'),
      defaultValue: 'active'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    totalEarned: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    lastLoginAt: {
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
    tableName: 'users',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['phone'] },
      { fields: ['userType'] },
      { fields: ['status'] }
    ]
  });

  return User;
};
