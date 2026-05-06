const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:b263AGY5JTSRPFrh@db.hkbkvnaptnhkoghuredj.supabase.co:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
});

async function clearOrders() {
  try {
    const res = await pool.query('DELETE FROM orders');
    console.log(`Deleted ${res.rowCount} orders.`);
  } catch (err) {
    console.error('Error clearing orders:', err.message);
  } finally {
    await pool.end();
  }
}

clearOrders();
