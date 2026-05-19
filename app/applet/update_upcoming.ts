import { Pool } from 'pg';

async function run() {
  const pool = new Pool();
  try {
    const res = await pool.query('SELECT id, title, "isUpcoming" FROM courses');
    console.log(res.rows);
    if (res.rows.length > 0) {
      await pool.query('UPDATE courses SET "isUpcoming" = true WHERE id = $1', [res.rows[0].id]);
      console.log('Updated course', res.rows[0].id, 'to upcoming');
    }
  } catch (error) {
    console.error(error);
  } finally {
    pool.end();
  }
}
run();
