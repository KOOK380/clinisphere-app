import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://postgres.hkbkvnaptnhkoghuredj:b263AGY5JTSRPFrh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const slug = 'deltest-' + Date.now();
        // Create course
        const { rows: cRows } = await pool.query(`
          INSERT INTO courses (title, slug, "shortDescription", "fullDescription", price, thumbnail, category)
          VALUES ('DelTest', $1, 'x', 'x', 1, 'x', 'x') RETURNING id;
        `, [slug]);
        const cId = cRows[0].id;
        console.log("Course created", cId);
        
        // Try delete
        await pool.query('UPDATE announcements SET "courseId" = NULL WHERE "courseId" = $1', [cId]);
        await pool.query('UPDATE order_items SET "courseId" = NULL WHERE "courseId" = $1', [cId]);
        await pool.query('DELETE FROM courses WHERE id = $1', [cId]);
        
        console.log("Success deleting course", cId);
    } catch (e: any) {
        console.error("error:", e.message);
    } finally {
        pool.end();
    }
})();
