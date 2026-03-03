module.exports = (sequelize, DataTypes) => {
  const Portfolio = sequelize.define('Portfolio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('video', 'image', 'link'),
      defaultValue: 'video'
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING(500)
    },
    category: {
      type: DataTypes.STRING(100)
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isPublic: {
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
    tableName: 'portfolios',
    timestamps: true,
    indexes: [
      { fields: ['creatorId'] },
      { fields: ['category'] },
      { fields: ['isPublic'] }
    ]
  });

  return Portfolio;
};
