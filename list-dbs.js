const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Benji28041970',
  port: 5432,
});

async function listDatabases() {
  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database;');
    console.log('Available databases:');
    console.log(res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

listDatabases();
