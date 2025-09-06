const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EcoAction = sequelize.define('EcoAction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM(
        'energy_saving',
        'waste_reduction',
        'water_conservation',
        'transportation',
        'food_sustainability',
        'renewable_energy',
        'biodiversity',
        'other'
      ),
      allowNull: false
    },
    impactLevel: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false
    },
    carbonFootprintReduction: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'CO2 reduction in kg'
    },
    waterSaved: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Water saved in liters'
    },
    wasteReduced: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Waste reduced in kg'
    },
    imageUrl: {
      type: DataTypes.STRING,
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
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coordinates: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['impactLevel']
      },
      {
        fields: ['isVerified']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return EcoAction;
};
