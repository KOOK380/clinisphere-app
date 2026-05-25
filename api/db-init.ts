export async function initDb(pool: any) {
  try {
    if (!pool) return;
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        email TEXT PRIMARY KEY,
        otp TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        type TEXT NOT NULL
      )
    `);

    // Default HTML templates
    const orderHTML = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eeeff0;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #1E3A8A; margin: 0;">Order Confirmation</h2>
  </div>
  <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <p style="font-size: 16px; color: #333;">Dear <strong>{{name}}</strong>,</p>
    <p style="font-size: 16px; color: #555; line-height: 1.5;">Thank you for your purchase! Your order <strong>#{{order_id}}</strong> has been successfully confirmed.</p>
    
    <div style="text-align: left; background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #3B2A8F; margin-top: 0;">Order Details</h3>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        {{item_details}}
      </ul>
      <p style="font-size: 16px; font-weight: bold; color: #1E3A8A; margin-bottom: 0;">Total: {{total_price}}</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="{{app_url}}/dashboard" style="background-color: #1E3A8A; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">View Order Dashboard</a>
    </div>
  </div>
  <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">If you have any questions, feel free to contact us.</p>
</div>
`;

    const thankYouHTML = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px; text-align: center; border: 1px solid #eeeff0; border-radius: 12px;">
  <h1 style="color: #08678C; margin-bottom: 10px;">Thank You! 🎉</h1>
  <p style="font-size: 18px; color: #444; line-height: 1.6;">Hello <strong>{{name}}</strong>, we truly appreciate you taking a step towards learning with us.</p>
  
  <div style="text-align: left; background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #3B2A8F; margin-top: 0;">Order Summary (#{{order_id}})</h3>
    <ul style="color: #555; font-size: 15px; padding-left: 20px;">
      {{item_details}}
    </ul>
    <p style="font-size: 16px; font-weight: bold; color: #1E3A8A; margin-bottom: 0;">Total Paid: {{total_price}}</p>
  </div>

  <p style="font-size: 16px; color: #666; margin-bottom: 30px;">Get ready to discover new skills. Your learning journey starts now!</p>
  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0; display: inline-block;">
    <p style="margin: 0; color: #166534; font-weight: bold;">Your access is permanently granted.</p>
  </div>
</div>
`;

    const registerOtpHTML = `
<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #eeeff0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
  <h2 style="color: #3B2A8F; text-align: center; margin-top: 0;">Verify Your Email</h2>
  <p style="font-size: 16px; color: #555; text-align: center;">Use the one-time password below to complete your registration:</p>
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
    <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1E3A8A;">{{otp}}</span>
  </div>
  <p style="font-size: 13px; color: #888; text-align: center;">This code will expire in 10 minutes. If you didn't request this, you can ignore this email.</p>
</div>
`;

    const forgotPasswordHTML = `
<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #eeeff0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
  <h2 style="color: #FF6B6B; text-align: center; margin-top: 0;">Password Reset</h2>
  <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">We received a request to reset the password for your account. Click the button below to proceed:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{reset_link}}" style="background-color: #3B2A8F; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
  </div>
  <p style="font-size: 13px; color: #888; text-align: center;">If you didn't request this, please safely ignore this email. The link will expire in 1 hour.</p>
</div>
`;

    const templates = [
      { key: 'order_confirm', subject: 'Order Confirmation', html: orderHTML },
      { key: 'thank_you', subject: 'Thank you for your purchase!', html: thankYouHTML },
      { key: 'register_otp', subject: 'Your Registration Verification Code', html: registerOtpHTML },
      { key: 'forgot_password', subject: 'Password Reset Request', html: forgotPasswordHTML }
    ];

    for (const t of templates) {
      if (t.key === 'thank_you' || t.key === 'register_otp' || t.key === 'forgot_password' || t.key === 'order_confirm') {
        const check = await pool.query('SELECT key FROM email_templates WHERE key = $1', [t.key]);
        if (check.rows.length > 0) {
           await pool.query('UPDATE email_templates SET subject = $1, body_html = $2 WHERE key = $3', [t.subject, t.html, t.key]);
        } else {
           await pool.query('INSERT INTO email_templates (key, subject, body_html) VALUES ($1, $2, $3)', [t.key, t.subject, t.html]);
        }
      } else {
        await pool.query(
          'INSERT INTO email_templates (key, subject, body_html) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
          [t.key, t.subject, t.html]
        );
      }
    }
    
    console.log("Database initialized with custom HTML templates.");
  } catch (err: any) {
    console.error("DB INIT ERROR:", err?.message);
  }
}
