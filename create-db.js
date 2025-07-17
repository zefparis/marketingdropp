const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Benji28041970',
  port: 5432,
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');
    
    // Check if database exists
    const dbCheck = await client.query("SELECT 1 FROM pg_database WHERE datname = 'digital_marketplace'");
    
    if (dbCheck.rows.length === 0) {
      console.log('Creating database digital_marketplace...');
      await client.query('CREATE DATABASE digital_marketplace');
      console.log('Database created successfully');
    } else {
      console.log('Database digital_marketplace already exists');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

createDatabase();
