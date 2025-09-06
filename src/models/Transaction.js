const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'paid',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'refunded',
        'disputed'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'bank_transfer', 'digital_wallet', 'cash', 'crypto', 'upi', 'netbanking', 'google_pay', 'phonepe', 'paytm', 'bharatpe', 'mobikwik'),
      allowNull: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    transactionFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    platformFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    ngoDonation: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
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
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'INR',
      validate: {
        len: [3, 3],
        isIn: [['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']]
      }
    },
    gstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    gstRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
        isDecimal: true
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    emiOption: {
      type: DataTypes.JSON,
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidAddress(value) {
          if (value && typeof value === 'object') {
            const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
            const missingFields = requiredFields.filter(field => !value[field]);
            if (missingFields.length > 0) {
              throw new Error(`Missing required address fields: ${missingFields.join(', ')}`);
            }
          }
        }
      }
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualDelivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    disputeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['buyerId']
      },
      {
        fields: ['sellerId']
      },
      {
        fields: ['itemId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['paymentMethod']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['buyerId', 'status']
      },
      {
        fields: ['sellerId', 'status']
      }
    ]
  });

  // Instance methods
  Transaction.prototype.updateStatus = function(newStatus, notes = null) {
    this.status = newStatus;
    if (notes) {
      this.notes = notes;
    }
    
    // Set completion timestamp for certain statuses
    if (['completed', 'cancelled', 'refunded'].includes(newStatus)) {
      this.resolvedAt = new Date();
    }
    
    return this.save();
  };

  Transaction.prototype.calculateFees = function() {
    const platformFeeRate = 0.05; // 5% platform fee
    const transactionFeeRate = 0.029; // 2.9% transaction fee
    
    this.platformFee = parseFloat((this.amount * platformFeeRate).toFixed(2));
    this.transactionFee = parseFloat((this.amount * transactionFeeRate).toFixed(2));
    
    return this.save();
  };

  // Class methods
  Transaction.associate = function(models) {
    // Transaction belongs to a buyer (User)
    Transaction.belongsTo(models.User, {
      foreignKey: 'buyerId',
      as: 'buyer',
      onDelete: 'CASCADE'
    });
    
    // Transaction belongs to a seller (User)
    Transaction.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller',
      onDelete: 'CASCADE'
    });
    
    // Transaction belongs to an item
    Transaction.belongsTo(models.Item, {
      foreignKey: 'itemId',
      as: 'item',
      onDelete: 'CASCADE'
    });
    
    // Transaction belongs to an NGO (optional)
    Transaction.belongsTo(models.NGO, {
      foreignKey: 'ngoId',
      as: 'ngo',
      onDelete: 'SET NULL'
    });
    
    // Transaction resolved by a user (admin/moderator)
    Transaction.belongsTo(models.User, {
      foreignKey: 'resolvedBy',
      as: 'resolver',
      onDelete: 'SET NULL'
    });
  };

  return Transaction;
};
