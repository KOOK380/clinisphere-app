import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://postgres.hkbkvnaptnhkoghuredj:b263AGY5JTSRPFrh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const { rows: oRows } = await pool.query('SELECT o.id FROM orders o LIMIT 1');
        if (oRows.length > 0) {
            console.log("Will delete order ", oRows[0].id)
            await pool.query('DELETE FROM orders WHERE id = $1', [oRows[0].id]);
            console.log("Deleted");
        } else {
            console.log("No orders");
        }
    } catch (e: any) {
        console.error("error:", e.message);
    } finally {
        pool.end();
    }
})();
