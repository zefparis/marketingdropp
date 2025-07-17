const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Initialize models
const models = {
  User: User(sequelize, DataTypes),
  Product: Product(sequelize, DataTypes),
  Order: Order(sequelize, DataTypes),
  OrderItem: OrderItem(sequelize, DataTypes)
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
