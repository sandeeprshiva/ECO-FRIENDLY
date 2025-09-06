const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserAchievement = sequelize.define('UserAchievement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    achievementId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Achievements',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    earnedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['achievementId']
      },
      {
        fields: ['earnedAt']
      },
      {
        fields: ['userId', 'achievementId'],
        unique: true
      }
    ]
  });

  // Class methods
  UserAchievement.associate = function(models) {
    // UserAchievement belongs to a user
    UserAchievement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
    
    // UserAchievement belongs to an achievement
    UserAchievement.belongsTo(models.Achievement, {
      foreignKey: 'achievementId',
      as: 'achievement',
      onDelete: 'CASCADE'
    });
  };

  return UserAchievement;
};
