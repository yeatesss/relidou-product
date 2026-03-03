module.exports = (sequelize, DataTypes) => {
  const CreatorProfile = sequelize.define('CreatorProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      defaultValue: '创作者'
    },
    bio: {
      type: DataTypes.TEXT
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    categories: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    startingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 5.0
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completedOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING(100)
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'creator_profiles',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['rating'] },
      { fields: ['verificationStatus'] }
    ]
  });

  return CreatorProfile;
};
