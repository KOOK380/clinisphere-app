import pkg from 'pg';
const { Pool } = pkg;
(async () => {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});
  try {
    const res = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'lessons\'');
    console.log("Lessons cols:", res.rows);
    const resC = await pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'courses\'');
    console.log("Courses cols:", resC.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
