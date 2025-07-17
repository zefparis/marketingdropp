const { Sequelize } = require('sequelize');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

// Initialize Sequelize with database connection
const sequelize = new Sequelize(
  process.env.PGDATABASE || 'digital_marketplace',
  process.env.PGUSER || 'postgres',
  process.env.PGPASSWORD || 'Benji28041970',
  {
    host: process.env.PGHOST || 'localhost',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      underscored: true, // Use snake_case for database column names
      timestamps: true,  // Add createdAt and updatedAt timestamps
      paranoid: true,    // Enable soft deletes
    },
  }
);

// Import all models
const db = {};

// Import models from files
const modelFiles = fs.readdirSync(path.join(__dirname, '../models'))
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.slice(-3) === '.js' &&
      !file.endsWith('.test.js')
    );
  });

// Initialize models
modelFiles.forEach(file => {
  const model = require(path.join(__dirname, '../models', file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected'.cyan.underline.bold);
    
    // Sync all models
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized'.green);
    }
  } catch (err) {
    console.error('Unable to connect to the database:'.red, err);
    process.exit(1);
  }
};

// Export the db object containing all models and the sequelize instance
module.exports = {
  ...db,
  sequelize,
  connectDB
};
