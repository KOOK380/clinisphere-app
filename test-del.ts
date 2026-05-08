import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://postgres.hkbkvnaptnhkoghuredj:b263AGY5JTSRPFrh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        await pool.query('DELETE FROM courses WHERE id = 1');
        console.log("Success!");
    } catch (e: any) {
        console.error("error:", e.message);
    } finally {
        pool.end();
    }
})();
