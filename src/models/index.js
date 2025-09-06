const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecofriend_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Import models
const User = require('./User')(sequelize);
const Item = require('./Item')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const NGO = require('./NGO')(sequelize);
const EcoImpact = require('./EcoImpact')(sequelize);
const Achievement = require('./Achievement')(sequelize);
const UserAchievement = require('./UserAchievement')(sequelize);

// Define associations
const models = { User, Item, Transaction, NGO, EcoImpact, Achievement, UserAchievement };

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync database (only in development)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database synchronized');
  }).catch(err => {
    console.error('❌ Database sync failed:', err);
  });
}

module.exports = {
  sequelize,
  testConnection,
  User,
  Item,
  Transaction,
  NGO,
  EcoImpact
};
