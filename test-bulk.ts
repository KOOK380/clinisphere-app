import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://postgres.hkbkvnaptnhkoghuredj:b263AGY5JTSRPFrh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const ids = [1];
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
        await pool.query(`UPDATE announcements SET "courseId" = NULL WHERE "courseId" IN (${placeholders})`, ids);
        await pool.query(`UPDATE order_items SET "courseId" = NULL WHERE "courseId" IN (${placeholders})`, ids);
        await pool.query(`DELETE FROM courses WHERE id IN (${placeholders})`, ids);
        console.log("Success");
    } catch (e: any) {
        console.error("error:", e.message);
    } finally {
        pool.end();
    }
})();
