const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 200],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    condition: {
      type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
      allowNull: false,
      defaultValue: 'good'
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      validate: {
        isValidImages(value) {
          if (value && value.length > 0) {
            const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
            const invalidImages = value.filter(img => !urlRegex.test(img));
            if (invalidImages.length > 0) {
              throw new Error('All images must be valid URLs with image extensions');
            }
          }
        }
      }
    },
    transactionType: {
      type: DataTypes.ENUM('sale', 'donation', 'exchange', 'rental'),
      allowNull: false,
      defaultValue: 'sale'
    },
    ngoId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'NGOs',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    ecoSavings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      validate: {
        isValidEcoSavings(value) {
          if (value && typeof value === 'object') {
            const allowedKeys = ['co2Saved', 'waterSaved', 'wasteReduced', 'energySaved'];
            const keys = Object.keys(value);
            const invalidKeys = keys.filter(key => !allowedKeys.includes(key));
            if (invalidKeys.length > 0) {
              throw new Error('Invalid eco savings keys. Allowed: co2Saved, waterSaved, wasteReduced, energySaved');
            }
          }
        }
      }
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
      allowNull: false
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
    model: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    coordinates: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isSold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    soldAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      validate: {
        maxTags(value) {
          if (value && value.length > 10) {
            throw new Error('Maximum 10 tags allowed');
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'sold', 'archived', 'rejected'),
      defaultValue: 'draft'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['sellerId']
      },
      {
        fields: ['category']
      },
      {
        fields: ['condition']
      },
      {
        fields: ['transactionType']
      },
      {
        fields: ['price']
      },
      {
        fields: ['isActive', 'isSold']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['title'],
        using: 'gin',
        operator: 'gin_trgm_ops'
      }
    ]
  });

  // Instance methods
  Item.prototype.incrementViews = function() {
    this.views += 1;
    return this.save();
  };

  Item.prototype.markAsSold = function() {
    this.isSold = true;
    this.soldAt = new Date();
    this.status = 'sold';
    return this.save();
  };

  // Class methods
  Item.associate = function(models) {
    // Item belongs to a seller (User)
    Item.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller',
      onDelete: 'CASCADE'
    });
    
    // Item belongs to an NGO (optional)
    Item.belongsTo(models.NGO, {
      foreignKey: 'ngoId',
      as: 'ngo',
      onDelete: 'SET NULL'
    });
    
    // Item has many transactions
    Item.hasMany(models.Transaction, {
      foreignKey: 'itemId',
      as: 'transactions',
      onDelete: 'CASCADE'
    });
    
    // Item has many eco impacts
    Item.hasMany(models.EcoImpact, {
      foreignKey: 'itemId',
      as: 'ecoImpacts',
      onDelete: 'CASCADE'
    });
  };

  return Item;
};
