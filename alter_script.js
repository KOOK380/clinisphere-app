require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://postgres.hkbkvnaptnhkoghuredj:b263AGY5JTSRPFrh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres' });
async function alter() {
  try {
    await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS title_en TEXT;`);
    await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS title_fr TEXT;`);
    await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS "shortDescription_en" TEXT;`);
    await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS "shortDescription_fr" TEXT;`);
    await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS "fullDescription_en" TEXT;`);
    await pool.query(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS "fullDescription_fr" TEXT;`);
    await pool.query(`ALTER TABLE modules ADD COLUMN IF NOT EXISTS title_en TEXT;`);
    await pool.query(`ALTER TABLE modules ADD COLUMN IF NOT EXISTS title_fr TEXT;`);
    await pool.query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_en TEXT;`);
    await pool.query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_fr TEXT;`);
    await pool.query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description_en TEXT;`);
    await pool.query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description_fr TEXT;`);
    console.log("Success");
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
alter();
