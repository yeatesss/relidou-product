module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
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
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    revieweeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFlagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    flagReason: {
      type: DataTypes.TEXT
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
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      { fields: ['orderId'] },
      { fields: ['reviewerId'] },
      { fields: ['revieweeId'] },
      { fields: ['rating'] }
    ]
  });

  return Review;
};
