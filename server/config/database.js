require('dotenv').config();

module.exports = {
  development: {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'Benji28041970',
    database: process.env.PGDATABASE || 'digital_marketplace',
    host: process.env.PGHOST || '127.0.0.1',
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },
  test: {
    username: process.env.TEST_PGUSER || 'postgres',
    password: process.env.TEST_PGPASSWORD || 'Benji28041970',
    database: process.env.TEST_PGDATABASE || 'digital_marketplace_test',
    host: process.env.TEST_PGHOST || '127.0.0.1',
    port: process.env.TEST_PGPORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
