import pg from 'pg';
import path from 'path';

// read the .env.example or whatever to get the connection string if needed?
// Let's rely on process.env.DATABASE_URL
const pool = new pg.Pool();

async function run() {
  try {
    const res = await pool.query('SELECT * FROM courses');
    console.log("Courses before:", res.rows.map(r => ({id: r.id, isUpcoming: r.isUpcoming})));
    
    // Attempt to set id=1 to upcoming
    if (res.rows.length > 0) {
      await pool.query('UPDATE courses SET "isUpcoming" = true WHERE id = $1', [res.rows[0].id]);
      console.log('Set course 1 to upcoming');
    }
    const res2 = await pool.query('SELECT * FROM courses');
    console.log("Courses after:", res2.rows.map(r => ({id: r.id, title: r.title, isUpcoming: r.isUpcoming})));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
