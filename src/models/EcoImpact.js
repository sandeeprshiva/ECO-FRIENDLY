const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EcoImpact = sequelize.define('EcoImpact', {
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
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Transactions',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    co2Saved: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'CO2 saved in kg'
    },
    waterSaved: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'Water saved in liters'
    },
    wasteReduced: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'Waste reduced in kg'
    },
    energySaved: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'Energy saved in kWh'
    },
    treesEquivalent: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      },
      comment: 'Equivalent trees planted'
    },
    impactScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 1000
      },
      comment: 'Calculated impact score (0-1000)'
    },
    impactType: {
      type: DataTypes.ENUM(
        'purchase',
        'sale',
        'donation',
        'exchange',
        'rental',
        'repair',
        'reuse',
        'recycle'
      ),
      allowNull: false,
      defaultValue: 'purchase'
    },
    calculationMethod: {
      type: DataTypes.ENUM('automatic', 'manual', 'verified'),
      allowNull: false,
      defaultValue: 'automatic'
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Additional impact calculation data'
    },
    category: {
      type: DataTypes.ENUM(
        'electronics',
        'clothing',
        'furniture',
        'books',
        'sports',
        'home_garden',
        'vehicles',
        'tools',
        'art_crafts',
        'other'
      ),
      allowNull: true
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    condition: {
      type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'Age of item in years'
    },
    weight: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: true,
      validate: {
        min: 0
      },
      comment: 'Weight of item in kg'
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['itemId']
      },
      {
        fields: ['transactionId']
      },
      {
        fields: ['impactType']
      },
      {
        fields: ['isVerified']
      },
      {
        fields: ['category']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['userId', 'createdAt']
      },
      {
        fields: ['co2Saved']
      },
      {
        fields: ['impactScore']
      }
    ]
  });

  // Instance methods
  EcoImpact.prototype.calculateImpactScore = function() {
    // Calculate impact score based on various factors
    let score = 0;
    
    // Base score from environmental impact
    score += Math.min(this.co2Saved * 10, 300); // Max 300 points for CO2
    score += Math.min(this.waterSaved * 0.1, 200); // Max 200 points for water
    score += Math.min(this.wasteReduced * 5, 200); // Max 200 points for waste
    score += Math.min(this.energySaved * 2, 150); // Max 150 points for energy
    score += Math.min(this.treesEquivalent * 20, 150); // Max 150 points for trees
    
    // Bonus for verification
    if (this.isVerified) {
      score += 50;
    }
    
    // Bonus for different impact types
    const typeBonuses = {
      'donation': 100,
      'exchange': 75,
      'repair': 50,
      'reuse': 25,
      'recycle': 15,
      'rental': 10,
      'purchase': 5,
      'sale': 0
    };
    
    score += typeBonuses[this.impactType] || 0;
    
    this.impactScore = Math.min(Math.round(score), 1000);
    return this.save();
  };

  EcoImpact.prototype.verify = function(verifiedBy) {
    this.isVerified = true;
    this.verifiedBy = verifiedBy;
    this.verificationDate = new Date();
    this.calculationMethod = 'verified';
    return this.save();
  };

  // Class methods
  EcoImpact.associate = function(models) {
    // EcoImpact belongs to a user
    EcoImpact.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
    
    // EcoImpact belongs to an item
    EcoImpact.belongsTo(models.Item, {
      foreignKey: 'itemId',
      as: 'item',
      onDelete: 'CASCADE'
    });
    
    // EcoImpact belongs to a transaction (optional)
    EcoImpact.belongsTo(models.Transaction, {
      foreignKey: 'transactionId',
      as: 'transaction',
      onDelete: 'SET NULL'
    });
    
    // EcoImpact verified by a user
    EcoImpact.belongsTo(models.User, {
      foreignKey: 'verifiedBy',
      as: 'verifier',
      onDelete: 'SET NULL'
    });
  };

  return EcoImpact;
};
