import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'lessons'", (err, res) => {
  if (err) console.error(err);
  else console.log("Lessons columns:", res.rows.map(r => r.column_name).join(', '));
  process.exit();
});
