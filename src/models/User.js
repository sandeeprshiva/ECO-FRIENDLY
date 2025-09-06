const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 255],
        notEmpty: true
      }
    },
    greenScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 1000
      },
      comment: 'User\'s environmental impact score (0-1000)'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'moderator', 'ngo'),
      defaultValue: 'user'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\+]?[1-9][\d]{0,15}$/
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    refreshTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
        // Set initial green score to 100 for new users
        if (!user.greenScore) {
          user.greenScore = 100;
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['greenScore']
      },
      {
        fields: ['location']
      },
      {
        fields: ['isVerified']
      }
    ]
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // Class methods
  User.associate = function(models) {
    // User has many items they're selling
    User.hasMany(models.Item, { 
      foreignKey: 'sellerId', 
      as: 'items',
      onDelete: 'CASCADE'
    });
    
    // User has many transactions as buyer
    User.hasMany(models.Transaction, { 
      foreignKey: 'buyerId', 
      as: 'purchases',
      onDelete: 'CASCADE'
    });
    
    // User has many transactions as seller
    User.hasMany(models.Transaction, { 
      foreignKey: 'sellerId', 
      as: 'sales',
      onDelete: 'CASCADE'
    });
    
    // User has many eco impacts
    User.hasMany(models.EcoImpact, { 
      foreignKey: 'userId', 
      as: 'ecoImpacts',
      onDelete: 'CASCADE'
    });
    
    // User has many achievements
    User.hasMany(models.UserAchievement, { 
      foreignKey: 'userId', 
      as: 'userAchievements',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
