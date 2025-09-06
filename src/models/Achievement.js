const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Achievement = sequelize.define('Achievement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM(
        'green_score',
        'transactions',
        'listings',
        'donations',
        'eco_impact',
        'social',
        'special'
      ),
      allowNull: false
    },
    badgeIcon: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    badgeColor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#4CAF50',
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      validate: {
        isValidRequirements(value) {
          if (typeof value !== 'object' || value === null) {
            throw new Error('Requirements must be a valid JSON object');
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isRare: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rarity: {
      type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
      defaultValue: 'common'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['rarity']
      },
      {
        fields: ['sortOrder']
      }
    ]
  });

  // Class methods
  Achievement.associate = function(models) {
    // Achievement has many user achievements
    Achievement.hasMany(models.UserAchievement, {
      foreignKey: 'achievementId',
      as: 'userAchievements',
      onDelete: 'CASCADE'
    });
  };

  return Achievement;
};
