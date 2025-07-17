const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'digital_marketplace',
  password: 'Benji28041970',
  port: 5432,
});

async function listTables() {
  try {
    await client.connect();
    console.log('Connected to digital_marketplace database');
    
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\nTables in digital_marketplace database:');
    if (res.rows.length > 0) {
      res.rows.forEach(row => console.log(`- ${row.table_name}`));
    } else {
      console.log('No tables found');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

listTables();
