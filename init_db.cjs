const { Pool } = require('pg');
const p = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:b263AGY5JTSRPFrh@db.hkbkvnaptnhkoghuredj.supabase.co:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await p.query(`
    CREATE TABLE IF NOT EXISTS otps (
      email TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      type TEXT NOT NULL
    )
  `);
  
  await p.query(`INSERT INTO email_templates (key, subject, body_html) VALUES ('register_otp', 'Your Verification Code', '<h1>Verification Code</h1><p>Your one-time password is: <strong>{{otp}}</strong></p>') ON CONFLICT (key) DO NOTHING`);
  
  await p.query(`INSERT INTO email_templates (key, subject, body_html) VALUES ('forgot_password_otp', 'Password Reset Code', '<h1>Password Reset</h1><p>Your password reset code is: <strong>{{otp}}</strong></p>') ON CONFLICT (key) DO NOTHING`);

  console.log('done');
  process.exit(0);
}
run();
