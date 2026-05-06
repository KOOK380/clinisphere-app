const { Pool } = require('pg');
const p = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:b263AGY5JTSRPFrh@db.hkbkvnaptnhkoghuredj.supabase.co:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await p.query(`INSERT INTO email_templates (key, subject, body_html) VALUES ('order_confirm', 'Order Confirmation', '<h1>Order Confirmed!</h1><p>Dear {{name}}, your order #{{order_id}} has been confirmed.</p>') ON CONFLICT (key) DO NOTHING`);
  await p.query(`INSERT INTO email_templates (key, subject, body_html) VALUES ('thank_you', 'Thank you for your purchase', '<h1>Thanks!</h1><p>We appreciate your purchase.</p>') ON CONFLICT (key) DO NOTHING`);
  await p.query(`INSERT INTO email_templates (key, subject, body_html) VALUES ('notification', '{{title}}', '<h1>{{title}}</h1><pre>{{message}}</pre>') ON CONFLICT (key) DO NOTHING`);
  await p.query(`INSERT INTO email_templates (key, subject, body_html) VALUES ('forgot_password', 'Password Reset', '<h1>Reset your password</h1><p>Click <a href="{{reset_link}}">here</a> to reset your password.</p>') ON CONFLICT (key) DO NOTHING`);
  console.log('done');
  process.exit(0);
}
run();
