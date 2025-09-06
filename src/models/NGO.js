const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NGO = sequelize.define('NGO', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 200],
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
    mission: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
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
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[\+]?[1-9][\d]{0,15}$/
      }
    },
    address: {
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
    coordinates: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
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
    bankDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidBankDetails(value) {
          if (value && typeof value === 'object') {
            const requiredFields = ['accountNumber', 'routingNumber', 'bankName'];
            const missingFields = requiredFields.filter(field => !value[field]);
            if (missingFields.length > 0) {
              throw new Error(`Missing required bank details: ${missingFields.join(', ')}`);
            }
          }
        }
      }
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [0, 50]
      }
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [0, 100]
      }
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear()
      }
    },
    focusAreas: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      validate: {
        maxFocusAreas(value) {
          if (value && value.length > 10) {
            throw new Error('Maximum 10 focus areas allowed');
          }
        }
      }
    },
    socialMedia: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      validate: {
        isValidSocialMedia(value) {
          if (value && typeof value === 'object') {
            const allowedPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
            const platforms = Object.keys(value);
            const invalidPlatforms = platforms.filter(platform => !allowedPlatforms.includes(platform));
            if (invalidPlatforms.length > 0) {
              throw new Error(`Invalid social media platforms. Allowed: ${allowedPlatforms.join(', ')}`);
            }
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    totalDonations: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    totalItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['email']
      },
      {
        fields: ['isVerified']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['focusAreas'],
        using: 'gin'
      },
      {
        fields: ['rating']
      },
      {
        fields: ['totalDonations']
      }
    ]
  });

  // Instance methods
  NGO.prototype.updateRating = function(newRating) {
    const totalRating = (this.rating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.rating = parseFloat((totalRating / this.reviewCount).toFixed(2));
    return this.save();
  };

  NGO.prototype.addDonation = function(amount) {
    this.totalDonations = parseFloat((parseFloat(this.totalDonations) + parseFloat(amount)).toFixed(2));
    return this.save();
  };

  NGO.prototype.incrementItemCount = function() {
    this.totalItems += 1;
    return this.save();
  };

  // Class methods
  NGO.associate = function(models) {
    // NGO has many items
    NGO.hasMany(models.Item, {
      foreignKey: 'ngoId',
      as: 'items',
      onDelete: 'SET NULL'
    });
    
    // NGO has many transactions
    NGO.hasMany(models.Transaction, {
      foreignKey: 'ngoId',
      as: 'transactions',
      onDelete: 'SET NULL'
    });
    
    // NGO verified by a user
    NGO.belongsTo(models.User, {
      foreignKey: 'verifiedBy',
      as: 'verifier',
      onDelete: 'SET NULL'
    });
  };

  return NGO;
};
