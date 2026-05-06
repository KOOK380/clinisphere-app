import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import slugify from 'slugify';
import multer from 'multer';
import pg from 'pg';
const { Pool } = pg;
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Storage } from '@google-cloud/storage';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import axios from 'axios';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://hkbkvnaptnhkoghuredj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_plvXRp6EFpGGy6cckbklPQ_-fqQ44-A';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://postgres:b263AGY5JTSRPFrh@db.hkbkvnaptnhkoghuredj.supabase.co:6543/postgres';

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.warn('');
  console.warn('=========================================');
  console.warn(' DATABASE CONNECTION STRING IS MISSING IN ENV! ');
  console.warn(' Falling back to hardcoded database URL. ');
  console.warn(' Please set DATABASE_URL in your Vercel ');
  console.warn(' Environment Variables to your Supabase IPv4 Pooler URL. ');
  console.warn('=========================================');
  console.warn('');
}

const pool = new Pool({
  connectionString: connectionString || '',
  ssl: connectionString && connectionString.includes('localhost') ? false : {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (connectionString) {
    try {
      const url = new URL(connectionString);
      console.log(`Attempting to connect to database at ${url.host}${url.pathname}`);
    } catch (e) {
      console.log('Attempting to connect to database (URL could not be parsed securely)');
    }
  } else {
    console.log('No database connection string provided on startup.');
  }
  
  if (err) {
    console.error('DATABASE INITIAL CONNECTION ERROR:', err.message, err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

let db: any = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    db = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Supabase initialization failed:', e);
  }
}

// Database helper
async function query(text: string, params?: any[], silent: boolean = false) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (err: any) {
    if (!silent) {
      console.error('DATABASE QUERY ERROR:', {
        text,
        error: err.message,
        stack: err.stack,
        code: err.code
      });
    }
    throw err;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWTKEY || 'super-secret-key-change-me';

// --- STORAGE HELPERS ---

async function ensureSupabaseBucket(bucketName: string) {
  if (!db) return;
  try {
    const { data: buckets, error: listError } = await db.storage.listBuckets();
    if (listError) {
      console.warn('Could not list Supabase buckets:', listError.message);
      return;
    }
    const exists = buckets?.find((b: any) => b.name === bucketName);
    if (!exists) {
      console.log(`Creating missing Supabase bucket: ${bucketName}`);
      const { error: createError } = await db.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
      if (createError) {
        console.error(`Failed to create bucket ${bucketName}:`, createError.message);
      }
    }
  } catch (e) {
    console.warn('Error ensuring Supabase bucket exists:', e);
  }
}

async function getStorageSettings() {
  const { rows } = await query('SELECT * FROM settings');
  const settings: any = {};
  rows?.forEach((row: any) => {
    settings[row.key] = row.value;
  });
  return settings;
}

async function sendEmail(to: string, templateKey: string, variables: any) {
  try {
    const { rows: settingsRows } = await query("SELECT key, value FROM settings WHERE key IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from')");
    const settings: any = {};
    if (settingsRows) settingsRows.forEach(r => settings[r.key] = r.value);

    if (!settings.smtp_host || !settings.smtp_user || !settings.smtp_pass) {
      console.warn('SMTP not configured, skipping email to', to);
      return;
    }

    const { rows: templateRows } = await query("SELECT subject, body_html FROM email_templates WHERE key = $1", [templateKey]);
    if (!templateRows || templateRows.length === 0) {
      console.warn('Template not found:', templateKey);
      return;
    }
    
    let subject = templateRows[0].subject;
    let html = templateRows[0].body_html;
    
    // Replace variables
    for (const key in variables) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, variables[key] || '');
      html = html.replace(regex, variables[key] || '');
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port) || 587,
      secure: parseInt(settings.smtp_port) === 465,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_pass,
      },
    });

    await transporter.sendMail({
      from: settings.smtp_from || '"Admin" <noreply@clinisphere.com>',
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to} (${templateKey})`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

async function uploadToProvider(file: any, folder: string, fileName: string) {
  const settings = await getStorageSettings();
  const provider = settings.storage_provider || 'supabase';
  const filePath = `${folder}/${fileName}`;

  if (provider === 's3') {
    const s3Client = new S3Client({
      region: settings.s3_region || process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: settings.s3_access_key || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: settings.s3_secret_key || process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      endpoint: settings.s3_endpoint || undefined, // For Cloudflare R2 or DigitalOcean Spaces
      forcePathStyle: settings.s3_endpoint ? true : false,
    });

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: settings.s3_bucket || process.env.AWS_S3_BUCKET || 'media',
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      },
    });

    await upload.done();
    const bucket = settings.s3_bucket || process.env.AWS_S3_BUCKET || 'media';
    const region = settings.s3_region || process.env.AWS_REGION || 'us-east-1';
    
    if (settings.s3_endpoint) {
      // Custom endpoint (R2, etc.)
      const baseUrl = settings.s3_custom_url || settings.s3_endpoint.replace(/\/$/, '');
      return `${baseUrl}/${bucket}/${filePath}`;
    }
    return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
  } 
  
  else if (provider === 'backblaze') {
    const s3Client = new S3Client({
      region: 'us-east-1', // B2 expects a region but it's largely ignored if endpoint is provided
      credentials: {
        accessKeyId: settings.b2_key_id || process.env.B2_KEY_ID || '',
        secretAccessKey: settings.b2_application_key || process.env.B2_APPLICATION_KEY || '',
      },
      endpoint: (settings.b2_endpoint || process.env.B2_ENDPOINT) ? `https://${settings.b2_endpoint || process.env.B2_ENDPOINT}` : undefined,
      forcePathStyle: true,
    });

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: settings.b2_bucket || process.env.B2_BUCKET || '',
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    const bucket = settings.b2_bucket || process.env.B2_BUCKET || '';
    const endpoint = settings.b2_endpoint || process.env.B2_ENDPOINT || '';
    return `https://${bucket}.${endpoint}/${filePath}`;
  }

  else if (provider === 'bunny') {
    const storageZone = settings.bunny_storage_zone;
    const apiKey = settings.bunny_api_key;
    const pullZone = settings.bunny_pull_zone_url?.replace(/\/$/, '');
    
    await axios.put(
      `https://storage.bunnycdn.com/${storageZone}/${filePath}`,
      file.buffer,
      {
        headers: {
          AccessKey: apiKey,
          'Content-Type': file.mimetype,
        },
      }
    );
    return `${pullZone}/${filePath}`;
  } 

  else if (provider === 'gcs') {
    const storage = new Storage({
      projectId: settings.gcs_project_id || process.env.GCS_PROJECT_ID,
      credentials: settings.gcs_credentials ? JSON.parse(settings.gcs_credentials) : undefined,
    });
    const bucketName = settings.gcs_bucket || process.env.GCS_BUCKET || 'media';
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(filePath);
    
    await blob.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
    });
    return `https://storage.googleapis.com/${bucketName}/${filePath}`;
  }

  else if (provider === 'local') {
    const uploadDir = path.join(process.cwd(), 'dist', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const finalDir = path.join(uploadDir, folder);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, filePath), file.buffer);
    
    const baseUrl = settings.local_storage_url?.replace(/\/$/, '') || '';
    return `${baseUrl}/uploads/${filePath}`;
  }

  // Default: Supabase
  const clientUrl = settings.supabase_url || supabaseUrl;
  const clientKey = settings.supabase_anon_key || supabaseAnonKey;

  if (!clientUrl || !clientKey) {
    throw new Error('Supabase client is not initialized. Please configure your Supabase URL and API Key in the Admin panel.');
  }

  const supabaseClient = createClient(clientUrl, clientKey);

  // Helper to ensure bucket exists with the dynamic client
  const ensureBucket = async (bucketName: string) => {
    try {
      const { data: buckets } = await supabaseClient.storage.listBuckets();
      const exists = buckets?.find((b: any) => b.name === bucketName);
      if (!exists) {
        await supabaseClient.storage.createBucket(bucketName, { public: true });
      }
    } catch (e) {
       console.warn('Error checking/creating Supabase bucket:', e);
    }
  };

  await ensureBucket('media');

  const { data, error } = await supabaseClient.storage
    .from('media')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    console.error('Supabase Storage Upload Error:', error);
    if (error.message === 'The resource was not found') {
      throw new Error('Supabase bucket "media" was not found or could not be created. Please verify your Supabase configuration.');
    }
    throw error;
  }

  const { data: { publicUrl } } = supabaseClient.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrl;
}

// --- END STORAGE HELPERS ---

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for Vercel (read-only filesystem)

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/svg+xml', 
      'video/mp4', 
      'video/webm', 
      'video/quicktime'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporté (Images: JPG, PNG, SVG | Vidéos: MP4, WEBM)'));
    }
  }
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Serve local uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'dist', 'uploads')));

// Root path for the API
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const envCheck = {
      has_url: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      has_key: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      node_env: process.env.NODE_ENV,
      is_vercel: !!process.env.VERCEL
    };

    if (!pool) {
      return res.status(200).json({ 
        status: 'warning',
        message: 'Database connection not initialized',
        env_check: envCheck
      });
    }

    const { rows } = await query('SELECT 1 as connected');
    
    const settings = await getStorageSettings();
    const clientUrl = settings.supabase_url || supabaseUrl;
    const clientKey = settings.supabase_anon_key || supabaseAnonKey;

    // Check storage
    let storageStatus = 'unknown';
    let storageDetails = '';
    
    if (clientUrl && clientKey) {
      try {
        const testClient = createClient(clientUrl, clientKey);
        const { data: buckets, error: bucketError } = await testClient.storage.listBuckets();
        if (bucketError) {
          storageStatus = 'error';
          storageDetails = bucketError.message;
        } else {
          const mediaBucket = buckets?.find((b: any) => b.name === 'media');
          storageStatus = mediaBucket ? 'ok' : 'missing_bucket';
          if (!mediaBucket) storageDetails = 'Bucket "media" not found';
        }
      } catch (e: any) {
        storageStatus = 'error';
        storageDetails = e.message;
      }
    } else {
      storageStatus = 'not_configured';
      storageDetails = 'Supabase URL or Key missing';
    }

    res.json({ 
      status: 'ok', 
      db_connection: 'success',
      connected: !!rows[0]?.connected,
      storage: {
        status: storageStatus,
        details: storageDetails,
        provider: 'supabase'
      },
      env_check: envCheck
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, stack: err.stack });
  }
});

// Database initialization
if (!process.env.VERCEL) {
  const initializeDatabase = async () => {
    try {
      // Check if tables exist
      const { rows } = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      const existingTables = rows.map(r => r.table_name);
      
      if (!existingTables.includes('users') || !existingTables.includes('events') || !existingTables.includes('articles')) {
        console.log('Database tables missing or incomplete. Initializing schema...');
        const schema = fs.readFileSync(path.join(process.cwd(), 'supabase_schema.sql'), 'utf8');
        
        // Split by semicolon, but handle potential issues with multiline strings or comments
        // This is a simple split that works for basic SQL files.
        const statements = schema
          .replace(/--.*$/gm, '') // Remove single line comments
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const statement of statements) {
          try {
            await query(statement, [], true);
          } catch (e: any) {
             // Ignore "already exists" and other non-critical errors during init
             if (!e.message.includes('already exists') && 
                 !e.message.includes('schema "auth" does not exist') &&
                 !e.message.includes('function auth.uid() does not exist')) {
               console.warn(`[DB INIT] Statement failed: ${e.message}`);
             }
          }
        }
        console.log('Database schema initialization attempt completed.');
      } else {
        console.log('Database tables verified.');
      }

      // Bilingual Fields Migrations
      try {
        // Courses
        await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS title_en TEXT');
        await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS title_fr TEXT');
        await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS "shortDescription_en" TEXT');
        await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS "shortDescription_fr" TEXT');
        await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS "fullDescription_en" TEXT');
        await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS "fullDescription_fr" TEXT');
        
        // Articles
        await query('ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_en TEXT');
        await query('ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_fr TEXT');
        await query('ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_en TEXT');
        await query('ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_fr TEXT');
        await query('ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_en TEXT');
        await query('ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_fr TEXT');

        // Events
        await query('ALTER TABLE events ADD COLUMN IF NOT EXISTS title_en TEXT');
        await query('ALTER TABLE events ADD COLUMN IF NOT EXISTS title_fr TEXT');
        await query('ALTER TABLE events ADD COLUMN IF NOT EXISTS description_en TEXT');
        await query('ALTER TABLE events ADD COLUMN IF NOT EXISTS description_fr TEXT');

        // Modules
        await query('ALTER TABLE modules ADD COLUMN IF NOT EXISTS title_en TEXT');
        await query('ALTER TABLE modules ADD COLUMN IF NOT EXISTS title_fr TEXT');

        // Lessons
        await query('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_en TEXT');
        await query('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS title_fr TEXT');
        await query('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description_en TEXT');
        await query('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS description_fr TEXT');

        // Storage Settings
        await query('ALTER TABLE settings ADD COLUMN IF NOT EXISTS supabase_url TEXT');
        await query('ALTER TABLE settings ADD COLUMN IF NOT EXISTS supabase_anon_key TEXT');
        
        console.log('Bilingual fields and storage settings verified/added successfully.');
      } catch (migrationError: any) {
        console.warn('Migration warning:', migrationError.message);
      }
      
      // Ensure admin exists
      const { rows: adminRows } = await query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
      const admin = adminRows?.[0];
      if (!admin) {
        const hashedPass = await bcrypt.hash('admin123', 10);
        await query(
          "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
          ['Admin', 'admin@clinisphere.com', hashedPass, 'admin']
        );
        console.log('Default admin created: admin@clinisphere.com / admin123');
      }
    } catch (e: any) {
      console.error('Database initialization failed:', e.message, e.stack);
    }
  };
  initializeDatabase();
}

// Auth Middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const settings = await getStorageSettings();
  const activeSecret = settings.jwt_secret || JWT_SECRET;

  jwt.verify(token, activeSecret, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Database Check Middleware
const checkDb = (req: any, res: any, next: any) => {
  if (!pool) {
    return res.status(503).json({ 
      error: 'Database connection not initialized', 
      details: 'Please ensure POSTGRES_URL or DATABASE_URL is set in your Environment Variables.' 
    });
  }
  next();
};

// Auth Routes
  app.post('/api/auth/register', checkDb, async (req, res) => {
    try {
      const { name, email, password, specialty, city, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { rows: userRows } = await query(
        'INSERT INTO users (name, email, password, specialty, city, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
        [name, email, hashedPassword, specialty, city, phone]
      );

      const user = userRows?.[0];
      if (!user) throw new Error('Failed to create user');

      const settings = await getStorageSettings();
      const activeSecret = settings.jwt_secret || JWT_SECRET;
      const token = jwt.sign({ userId: user.id, role: user.role }, activeSecret);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', checkDb, async (req, res) => {
    try {
      const { email, password } = req.body;
      const { rows: userRows } = await query('SELECT * FROM users WHERE email = $1', [email]);
      const user = userRows?.[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const settings = await getStorageSettings();
      const activeSecret = settings.jwt_secret || JWT_SECRET;
      const token = jwt.sign({ userId: user.id, role: user.role }, activeSecret);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed: ' + error.message });
    }
  });

  app.post('/api/auth/forgot-password', checkDb, async (req, res) => {
    try {
      const { email } = req.body;
      const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (!rows || rows.length === 0) {
        return res.json({ success: true }); // pretend it succeed for security
      }
      
      const user = rows[0];
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour
      
      await query('INSERT INTO password_resets (email, token, "expiresAt") VALUES ($1, $2, $3)', [email, token, expiresAt]);
      
      const resetLink = req.protocol + '://' + req.get('host') + '/reset-password?token=' + token;
      
      await sendEmail(email, 'forgot_password', { reset_link: resetLink });
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/auth/reset-password', checkDb, async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const { rows } = await query('SELECT * FROM password_resets WHERE token = $1 AND "expiresAt" > NOW()', [token]);
      
      if (!rows || rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      const email = rows[0].email;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
      await query('DELETE FROM password_resets WHERE email = $1', [email]);
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed' });
    }
  });

  // Course Routes
  app.get('/api/courses', checkDb, async (req, res) => {
    try {
      const { category, level, minPrice, maxPrice, search, limit = 10, offset = 0 } = req.query;
      
      let sql = `
        SELECT c.*, i.name as "instructorName", i.image as "instructorImage"
        FROM courses c
        LEFT JOIN instructors i ON c."instructorId" = i.id
        WHERE c."isPublished" = true
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (category) {
        sql += ` AND c.category = $${paramIndex++}`;
        params.push(category);
      }
      if (level) {
        sql += ` AND c.level = $${paramIndex++}`;
        params.push(level);
      }
      if (minPrice) {
        sql += ` AND c.price >= $${paramIndex++}`;
        params.push(Number(minPrice));
      }
      if (maxPrice) {
        sql += ` AND c.price <= $${paramIndex++}`;
        params.push(Number(maxPrice));
      }
      if (search) {
        sql += ` AND (c.title ILIKE $${paramIndex} OR c."shortDescription" ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      sql += ` ORDER BY c."createdAt" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(Number(limit), Number(offset));

      const { rows: courses } = await query(sql, params);
      res.json(courses);
    } catch (err: any) {
      console.error('DATABASE ERROR on /api/courses:', err.message);
      res.status(500).json({ error: 'Failed to fetch courses: ' + err.message });
    }
  });

  app.get('/api/courses/:slug', checkDb, async (req, res) => {
    try {
      const isId = /^\d+$/.test(req.params.slug);
      const { rows: courseRows } = await query(
        `SELECT c.*, i.name as "instructorName", i.bio as "instructorBio", i.image as "instructorImage" 
         FROM courses c 
         LEFT JOIN instructors i ON c."instructorId" = i.id 
         WHERE ${isId ? 'c.id = $1' : 'c.slug = $1'}`,
        [isId ? parseInt(req.params.slug) : req.params.slug]
      );
      
      const course = courseRows?.[0];
      if (!course) return res.status(404).json({ error: 'Course not found' });

      // Fetch modules and lessons separately for nesting
      const { rows: modules } = await query(
        'SELECT * FROM modules WHERE "courseId" = $1 ORDER BY "order" ASC',
        [course.id]
      );

      for (const mod of modules) {
        const { rows: lessons } = await query(
          'SELECT * FROM lessons WHERE "moduleId" = $1 ORDER BY "order" ASC',
          [mod.id]
        );
        mod.lessons = lessons;
      }

      course.modules = modules;
      res.json(course);
    } catch (err: any) {
      console.error('Error fetching course:', err.message);
      res.status(500).json({ error: 'Failed to fetch course details' });
    }
  });

  app.post('/api/courses', authenticateToken, checkDb, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const data = req.body;
      const slug = data.slug || slugify(data.title_fr || data.title, { lower: true, strict: true });
      
      const totalLessons = data.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;

      const { rows: courseRows } = await query(
        `INSERT INTO courses (
          title, title_en, title_fr, slug, "shortDescription", "shortDescription_en", "shortDescription_fr", 
          "fullDescription", "fullDescription_en", "fullDescription_fr", price, "discountPrice", 
          thumbnail, "previewVideo", category, level, "instructorId", duration, 
          "totalLessons", language, tags, "isFeatured", "isPublished"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) 
        RETURNING *`,
        [
          data.title_fr || data.title, data.title_en, data.title_fr, slug, 
          data.shortDescription_fr || data.shortDescription, data.shortDescription_en, data.shortDescription_fr,
          data.fullDescription_fr || data.fullDescription, data.fullDescription_en, data.fullDescription_fr, 
          data.price, data.discountPrice,
          data.thumbnail, data.previewVideo, data.category, data.level, data.instructorId, data.duration,
          totalLessons, data.language, data.tags || [], data.isFeatured ? true : false, data.isPublished ? true : false
        ]
      );

      const courseId = courseRows?.[0].id;

      if (data.modules && Array.isArray(data.modules)) {
        for (let mIdx = 0; mIdx < data.modules.length; mIdx++) {
          const mod = data.modules[mIdx];
          const { rows: modRows } = await query(
            'INSERT INTO modules ("courseId", title, title_en, title_fr, "order") VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [courseId, mod.title_fr || mod.title, mod.title_en, mod.title_fr, mIdx]
          );

          const moduleId = modRows?.[0].id;

          if (mod.lessons && Array.isArray(mod.lessons)) {
            for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
              const lesson = mod.lessons[lIdx];
              await query(
                `INSERT INTO lessons (
                  "moduleId", title, title_en, title_fr, description, description_en, description_fr, 
                  "videoUrl", content, duration, "isFreePreview", "order"
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                  moduleId, 
                  lesson.title_fr || lesson.title, lesson.title_en, lesson.title_fr,
                  lesson.description_fr || lesson.description, lesson.description_en, lesson.description_fr,
                  lesson.videoUrl, lesson.content, lesson.duration, lesson.isFreePreview ? true : false, lIdx
                ]
              );
            }
          }
        }
      }
      
      res.json(courseRows?.[0]);
    } catch (error: any) {
      res.status(400).json({ error: 'Failed to create course: ' + error.message });
    }
  });

  app.put('/api/courses/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const data = req.body;
      const slug = data.slug || slugify(data.title_fr || data.title, { lower: true, strict: true });

      const { rows: courseRows } = await query(
        `UPDATE courses SET 
          title = $1, title_en = $2, title_fr = $3, slug = $4, 
          "shortDescription" = $5, "shortDescription_en" = $6, "shortDescription_fr" = $7, 
          "fullDescription" = $8, "fullDescription_en" = $9, "fullDescription_fr" = $10, 
          price = $11, "discountPrice" = $12, thumbnail = $13, "previewVideo" = $14, 
          category = $15, level = $16, "instructorId" = $17, duration = $18, 
          language = $19, tags = $20, "isFeatured" = $21, "isPublished" = $22, 
          "updatedAt" = CURRENT_TIMESTAMP 
        WHERE id = $23 RETURNING *`,
        [
          data.title_fr || data.title, data.title_en, data.title_fr, slug, 
          data.shortDescription_fr || data.shortDescription, data.shortDescription_en, data.shortDescription_fr,
          data.fullDescription_fr || data.fullDescription, data.fullDescription_en, data.fullDescription_fr,
          data.price, data.discountPrice, data.thumbnail, data.previewVideo, data.category, data.level, 
          data.instructorId, data.duration, data.language, data.tags || [], 
          data.isFeatured ? true : false, data.isPublished ? true : false,
          req.params.id
        ]
      );

      if (data.modules && Array.isArray(data.modules)) {
        await query('DELETE FROM modules WHERE "courseId" = $1', [req.params.id]);
        for (let mIdx = 0; mIdx < data.modules.length; mIdx++) {
          const mod = data.modules[mIdx];
          const { rows: modRows } = await query(
            'INSERT INTO modules ("courseId", title, title_en, title_fr, "order") VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [req.params.id, mod.title_fr || mod.title, mod.title_en, mod.title_fr, mIdx]
          );

          const moduleId = modRows?.[0].id;

          if (mod.lessons && Array.isArray(mod.lessons)) {
            for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
              const lesson = mod.lessons[lIdx];
              await query(
                `INSERT INTO lessons (
                  "moduleId", title, title_en, title_fr, description, description_en, description_fr, 
                  "videoUrl", content, duration, "isFreePreview", "order"
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                  moduleId, 
                  lesson.title_fr || lesson.title, lesson.title_en, lesson.title_fr,
                  lesson.description_fr || lesson.description, lesson.description_en, lesson.description_fr,
                  lesson.videoUrl, lesson.content, lesson.duration, lesson.isFreePreview ? true : false, lIdx
                ]
              );
            }
          }
        }
      }

      res.json(courseRows?.[0]);
    } catch (error: any) {
      res.status(400).json({ error: 'Failed to update course: ' + error.message });
    }
  });

  app.delete('/api/courses/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM courses WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete course' });
    }
  });

  // Settings Routes
  app.get('/api/settings', async (req, res) => {
    try {
      const { rows } = await query('SELECT * FROM settings');
      const settings: any = {};
      rows.forEach((row: any) => {
        settings[row.key] = row.value;
      });

      // Include info about what's set in ENV (sensitive values masked)
      const envStatus = {
        supabase_url: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
        supabase_anon_key: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
        jwt_secret: !!(process.env.JWT_SECRET || process.env.JWTKEY),
        gemini_api_key: !!process.env.GEMINI_API_KEY,
        s3_access: !!(process.env.AWS_ACCESS_KEY_ID),
        gcs_project: !!(process.env.GCS_PROJECT_ID),
        bunny_key: !!(process.env.BUNNY_API_KEY),
        b2_access: !!(process.env.B2_KEY_ID),
        chargily_test_secret_key: !!(process.env.CHARGILY_TEST_SECRET_KEY || process.env.CHARGILY_SECRET_KEY),
        chargily_test_public_key: !!(process.env.CHARGILY_TEST_PUBLIC_KEY || process.env.CHARGILY_PUBLIC_KEY),
        chargily_live_secret_key: !!(process.env.CHARGILY_LIVE_SECRET_KEY),
        chargily_live_public_key: !!(process.env.CHARGILY_LIVE_PUBLIC_KEY)
      };

      res.json({ ...settings, _envStatus: envStatus });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const settings = req.body;
      for (const [key, value] of Object.entries(settings)) {
        if (key === '_envStatus') continue; // Don't save env status to the database
        await query(
          'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
          [key, String(value)]
        );
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: 'Failed to update settings: ' + error.message });
    }
  });

  // Upload Route
  app.post('/api/upload', authenticateToken, upload.single('file'), async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    try {
      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const isSlider = req.query.type === 'slider';
      const folder = isSlider ? 'slider' : 'logos';

      const publicUrl = await uploadToProvider(file, folder, fileName);

      res.json({ url: publicUrl });
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
  });

  // Slider Routes
  app.get('/api/slider', async (req, res) => {
    try {
      const { rows } = await query('SELECT * FROM home_slider ORDER BY "order" ASC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch slider items' });
    }
  });

  app.post('/api/slider', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { type, url, title, subtitle, buttonText, buttonLink, order } = req.body;
      const { rows } = await query(
        `INSERT INTO home_slider (type, url, title, subtitle, "buttonText", "buttonLink", "order") 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [type, url, title, subtitle, buttonText, buttonLink, order || 0]
      );
      res.json({ id: rows?.[0].id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add slider item' });
    }
  });

  app.put('/api/slider/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { type, url, title, subtitle, buttonText, buttonLink, order, isActive } = req.body;
      await query(
        `UPDATE home_slider SET 
          type = $1, url = $2, title = $3, subtitle = $4, "buttonText" = $5, 
          "buttonLink" = $6, "order" = $7, "isActive" = $8 
         WHERE id = $9`,
        [type, url, title, subtitle, buttonText, buttonLink, order, isActive ? true : false, req.params.id]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update slider item' });
    }
  });

  app.delete('/api/slider/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM home_slider WHERE id = $1', [req.params.id]);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Database error while deleting: ' + error.message });
    }
  });

  // Instructor Routes
  app.get('/api/instructors', async (req, res) => {
    try {
      const { rows } = await query('SELECT * FROM instructors');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch instructors' });
    }
  });

  app.get('/api/instructors/:id', async (req, res) => {
    try {
      const { rows: instructorRows } = await query('SELECT * FROM instructors WHERE id = $1', [req.params.id]);
      const instructor = instructorRows?.[0];
      if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
      
      const { rows: courses } = await query('SELECT * FROM courses WHERE "instructorId" = $1', [req.params.id]);
      res.json({ ...(instructor as any), courses });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch instructor' });
    }
  });

  app.post('/api/instructors', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { name, specialty, bio, image } = req.body;
      const { rows } = await query(
        'INSERT INTO instructors (name, specialty, bio, image) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, specialty, bio, image]
      );
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create instructor' });
    }
  });

  app.put('/api/instructors/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { name, specialty, bio, image } = req.body;
      const { rows } = await query(
        'UPDATE instructors SET name = $1, specialty = $2, bio = $3, image = $4 WHERE id = $5 RETURNING *',
        [name, specialty, bio, image, req.params.id]
      );
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update instructor' });
    }
  });

  app.delete('/api/instructors/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM instructors WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete instructor' });
    }
  });

  app.delete('/api/courses/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM courses WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete course' });
    }
  });

  // Order Routes
  app.post('/api/webhooks/chargily', async (req: any, res) => {
    try {
      const event = req.body;
      if (event?.type === 'checkout.paid') {
        const orderId = event.data?.metadata?.[0]?.order_id;
        if (orderId) {
          await query('UPDATE orders SET status = $1 WHERE id = $2', ['completed', orderId]);
          
          // Send emails
          const { rows: orderRows } = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
          if (orderRows && orderRows.length > 0) {
            const { rows: userRows } = await query('SELECT * FROM users WHERE id = $1', [orderRows[0].userId]);
            if (userRows && userRows.length > 0) {
              const userEmail = userRows[0].email;
              await sendEmail(userEmail, 'order_confirm', { name: userRows[0].name, order_id: orderId });
              await sendEmail(userEmail, 'thank_you', { name: userRows[0].name });
            }
          }
        }
      }
      res.status(200).send('OK');
    } catch (err) {
      res.status(500).send('Error');
    }
  });

  app.post('/api/orders', authenticateToken, async (req: any, res) => {
    try {
      const { items, totalPrice, billingAddress } = req.body;

      const { rows: orderRows } = await query(
        'INSERT INTO orders ("userId", "totalPrice", billing_address) VALUES ($1, $2, $3) RETURNING id',
        [req.user.userId, totalPrice, billingAddress || null]
      );
      
      const orderId = orderRows?.[0].id;
      
      for (const item of items) {
        if (item.itemType === 'event') {
          await query(
            'INSERT INTO order_items ("orderId", "eventId", "itemType", price) VALUES ($1, $2, $3, $4)',
            [orderId, item.id, 'event', item.price]
          );
        } else {
          await query(
            'INSERT INTO order_items ("orderId", "courseId", "itemType", price) VALUES ($1, $2, $3, $4)',
            [orderId, item.id, 'course', item.price]
          );
        }
      }

      const { rows: settingsRows } = await query('SELECT key, value FROM settings');
      const settings = settingsRows?.reduce((acc: any, row: any) => {
        acc[row.key] = row.value;
        return acc;
      }, {});

      const chargilyMode = settings?.chargily_mode || 'test';
      const isTest = chargilyMode === 'test';
      let chargilySecretKey = isTest 
        ? (process.env.CHARGILY_TEST_SECRET_KEY || settings?.chargily_test_secret_key)
        : (process.env.CHARGILY_LIVE_SECRET_KEY || settings?.chargily_live_secret_key);
        
      // Backwards compatibility
      if (!chargilySecretKey) {
        chargilySecretKey = process.env.CHARGILY_SECRET_KEY || settings?.chargilySecretKey;
      }

      if (chargilySecretKey) {
        const fallbackIsTest = chargilySecretKey.includes('test');
        const finalIsTest = chargilySecretKey === (process.env.CHARGILY_TEST_SECRET_KEY || settings?.chargily_test_secret_key) ? true : 
                            chargilySecretKey === (process.env.CHARGILY_LIVE_SECRET_KEY || settings?.chargily_live_secret_key) ? false :
                            fallbackIsTest;

        const endpoint = finalIsTest ? 'https://pay.chargily.net/test/api/v2/checkouts' : 'https://pay.chargily.net/api/v2/checkouts';
        const hostname = req.get('host');
        // AI studio proxy handling for frontend
        const protocol = hostname.includes('localhost') ? 'http' : 'https';

        const checkoutData = {
            amount: totalPrice,
            currency: "dzd",
            success_url: `${protocol}://${hostname}/checkout/success?order_id=${orderId}`,
            failure_url: `${protocol}://${hostname}/checkout/failure?order_id=${orderId}`,
            webhook_endpoint: `${protocol}://${hostname}/api/webhooks/chargily`,
            metadata: [
              { order_id: orderId.toString() }
            ]
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${chargilySecretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkoutData)
        });

        if (response.ok) {
          const data: any = await response.json();
          let checkoutUrl = data.checkout_url;
          if (checkoutUrl && checkoutUrl.startsWith('http://')) {
            checkoutUrl = checkoutUrl.replace('http://', 'https://');
          }
          return res.json({ checkoutUrl, orderId });
        } else {
          const err = await response.text();
          console.error("Chargily Error:", err);
          return res.json({ orderId });
        }
      }
      
      // Fallback if no chargily
      await query('UPDATE orders SET status = $1 WHERE id = $2', ['completed', orderId]);
      await sendEmail(req.user.email, 'order_confirm', { name: req.user.name || req.user.email, order_id: orderId });
      await sendEmail(req.user.email, 'thank_you', { name: req.user.name || req.user.email });
      
      res.json(orderRows?.[0]);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to create order' });
    }
  });

  app.get('/api/my-courses', authenticateToken, checkDb, async (req: any, res) => {
    try {
      const { rows: orders } = await query('SELECT id FROM orders WHERE "userId" = $1', [req.user.userId]);
      if (!orders || orders.length === 0) return res.json([]);
      
      const orderIds = orders.map((o: any) => o.id);
      const { rows: items } = await query(
        `SELECT c.*, i.name as "instructorName", i.image as "instructorImage"
         FROM order_items oi
         JOIN courses c ON oi."courseId" = c.id
         LEFT JOIN instructors i ON c."instructorId" = i.id
         WHERE oi."orderId" = ANY($1::bigint[])`,
        [orderIds]
      );

      // Deduplicate courses
      const coursesMap = new Map();
      items?.forEach((c: any) => {
        coursesMap.set(c.id, c);
      });

      res.json(Array.from(coursesMap.values()));
    } catch (error: any) {
      console.error('My courses error:', error);
      res.status(500).json({ error: 'Failed to fetch your courses: ' + error.message });
    }
  });

  // Contact Route
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const { rows } = await query(
        'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
        [name, email, message]
      );

      // SMTP Integration
      try {
        const settings = await getStorageSettings();
        if (settings.smtp_host && settings.smtp_user && settings.smtp_pass) {
          const transporter = nodemailer.createTransport({
            host: settings.smtp_host,
            port: Number(settings.smtp_port) || 587,
            secure: settings.smtp_secure === '1',
            auth: {
              user: settings.smtp_user,
              pass: settings.smtp_pass,
            },
          });

          const mailOptions = {
            from: settings.smtp_from || settings.smtp_user,
            to: settings.smtp_admin || settings.contact_email || settings.smtp_user,
            subject: `Nouveau message de contact: ${name}`,
            text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email
          };

          await transporter.sendMail(mailOptions);
          console.log('Contact email sent successfully');
        }
      } catch (smtpError) {
        console.error('SMTP Error:', smtpError);
        // We don't fail the request if email fails, as the contact is saved in DB
      }

      res.json(rows?.[0]);
    } catch (error: any) {
      console.error('Contact error:', error);
      res.status(400).json({ error: 'Failed to save message: ' + error.message });
    }
  });

  // Article Routes
  app.get('/api/articles', async (req, res) => {
    try {
      const { rows } = await query('SELECT * FROM articles WHERE "isPublished" = true ORDER BY "createdAt" DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  });

  app.get('/api/articles/:slug', async (req, res) => {
    try {
      const { rows } = await query('SELECT * FROM articles WHERE slug = $1', [req.params.slug]);
      if (rows.length === 0) return res.status(404).json({ error: 'Article not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  });

  app.get('/api/admin/articles', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows } = await query('SELECT * FROM articles ORDER BY "createdAt" DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles for admin' });
    }
  });

  app.get('/api/admin/articles/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows } = await query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Article not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch article for admin' });
    }
  });

  app.post('/api/admin/articles', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { title, title_en, title_fr, excerpt, excerpt_en, excerpt_fr, content, content_en, content_fr, image, author, category, isPublished } = req.body;
      const slug = slugify(title_fr || title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
      const { rows } = await query(
        `INSERT INTO articles (
          title, title_en, title_fr, slug, excerpt, excerpt_en, excerpt_fr, 
          content, content_en, content_fr, image, author, category, "isPublished"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [
          title_fr || title, title_en, title_fr, slug, 
          excerpt_fr || excerpt, excerpt_en, excerpt_fr, 
          content_fr || content, content_en, content_fr, 
          image, author, category, isPublished !== false
        ]
      );
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create article' });
    }
  });

  app.put('/api/admin/articles/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { title, title_en, title_fr, excerpt, excerpt_en, excerpt_fr, content, content_en, content_fr, image, author, category, isPublished } = req.body;
      const { rows } = await query(
        `UPDATE articles SET 
          title = $1, title_en = $2, title_fr = $3, 
          excerpt = $4, excerpt_en = $5, excerpt_fr = $6, 
          content = $7, content_en = $8, content_fr = $9, 
          image = $10, author = $11, category = $12, "isPublished" = $13, "updatedAt" = CURRENT_TIMESTAMP 
         WHERE id = $14 RETURNING *`,
        [
          title_fr || title, title_en, title_fr, 
          excerpt_fr || excerpt, excerpt_en, excerpt_fr, 
          content_fr || content, content_en, content_fr, 
          image, author, category, isPublished !== false, req.params.id
        ]
      );
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update article' });
    }
  });

  app.delete('/api/admin/articles/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM articles WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete article' });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows: users } = await query('SELECT id, name, email, role, specialty, city, "createdAt" FROM users');
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch users: ' + error.message });
    }
  });

  app.get('/api/admin/orders', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows: orders } = await query(
        `SELECT o.*, u.name as "userName", u.email as "userEmail"
         FROM orders o
         LEFT JOIN users u ON o."userId" = u.id
         ORDER BY o."createdAt" DESC`
      );
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch orders: ' + error.message });
    }
  });

  app.get('/api/admin/contacts', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows: contacts } = await query('SELECT * FROM contacts ORDER BY "createdAt" DESC');
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch contacts: ' + error.message });
    }
  });

  app.get('/api/admin/instructors', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows: instructors } = await query('SELECT * FROM instructors ORDER BY name ASC');
      res.json(instructors);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch instructors: ' + error.message });
    }
  });

  // Event Routes
  app.get('/api/events', async (req, res) => {
    try {
      let { rows: events } = await query(
        'SELECT * FROM events WHERE status = $1 ORDER BY "eventDate" ASC',
        ['published']
      );
      
      // Seed fallback data if empty
      if (!events || events.length === 0) {
        const fallbackEvents = [
          {
            title_en: "Masterclass: Advanced Gynecological Surgery",
            title_fr: "Masterclass : Chirurgie Gynécologique Avancée",
            description_en: "Join fellow specialists for a comprehensive exploration of minimally invasive surgical techniques and contemporary clinical practices.",
            description_fr: "Une exploration approfondie des techniques chirurgicales mini-invasives et des pratiques cliniques contemporaines pour les spécialistes.",
            eventDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            location: "Medical Training Center, Algiers",
            type: "paid",
            price: 500,
            banner: "https://images.unsplash.com/photo-1505751172107-573225a94091?auto=format&fit=crop&q=80&w=1200",
            status: "published"
          },
          {
            title_en: "The Evolution of Laparoscopic Training",
            title_fr: "L'Évolution de la Formation en Laparoscopie",
            description_en: "An evidence-based discussion on the integration of robotic assistance within modern surgical curricula.",
            description_fr: "Une discussion basée sur des preuves concernant l'intégration de l'assistance robotique dans les cursus chirurgicaux modernes.",
            eventDate: new Date(Date.now() + 86400000 * 14).toISOString(),
            location: "Interactive Webinar",
            type: "free",
            price: 0,
            banner: "https://images.unsplash.com/photo-1576091160550-217359f4812f?auto=format&fit=crop&q=80&w=1200",
            status: "published"
          }
        ];
        
        for (const fe of fallbackEvents) {
          await query(
            `INSERT INTO events (title_en, title_fr, description_en, description_fr, "eventDate", location, type, price, banner, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [fe.title_en, fe.title_fr, fe.description_en, fe.description_fr, fe.eventDate, fe.location, fe.type, fe.price, fe.banner, fe.status]
          );
        }

        const { rows: seeded } = await query('SELECT * FROM events WHERE status = $1', ['published']);
        events = seeded;
      }

      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const { rows } = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(404).json({ error: 'Event not found' });
    }
  });

  // Admin Event Routes
  app.get('/api/admin/events', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows: events } = await query('SELECT * FROM events ORDER BY "createdAt" DESC');
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events for admin' });
    }
  });

  app.get('/api/admin/events/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows } = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
      res.json(rows[0]);
    } catch (error) {
      res.status(404).json({ error: 'Event not found' });
    }
  });

  app.post('/api/admin/events', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const b = req.body;
      const { rows } = await query(
        `INSERT INTO events (title_en, title_fr, description_en, description_fr, "eventDate", location, type, price, banner, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [b.title_en, b.title_fr, b.description_en, b.description_fr, b.eventDate, b.location, b.type, b.price, b.banner, b.status]
      );
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create event' });
    }
  });

  app.put('/api/admin/events/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const b = req.body;
      const { rows } = await query(
        `UPDATE events SET 
          title_en = $1, title_fr = $2, description_en = $3, description_fr = $4, 
          "eventDate" = $5, location = $6, type = $7, price = $8, banner = $9, 
          status = $10, "updatedAt" = CURRENT_TIMESTAMP 
         WHERE id = $11 RETURNING *`,
        [b.title_en, b.title_fr, b.description_en, b.description_fr, b.eventDate, b.location, b.type, b.price, b.banner, b.status, req.params.id]
      );
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update event' });
    }
  });

  app.delete('/api/admin/events/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM events WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete event' });
    }
  });

  // Announcements / Notifications
  app.get('/api/admin/announcements', authenticateToken, checkDb, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows } = await query(
        `SELECT a.*, c.title as "courseTitle", e.title_en as "eventTitle" 
         FROM announcements a
         LEFT JOIN courses c ON a."courseId" = c.id
         LEFT JOIN events e ON a."eventId" = e.id
         ORDER BY a."createdAt" DESC`
      );
      res.json(rows || []);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to fetch announcements' });
    }
  });

  app.post('/api/admin/announcements', authenticateToken, checkDb, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { courseId, eventId, title, message } = req.body;
      const { rows } = await query(
        `INSERT INTO announcements ("courseId", "eventId", title, message) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [courseId || null, eventId || null, title, message]
      );
      
      const paramIndex = courseId ? 1 : eventId ? 1 : null;
      let usersToEmail: any[] = [];
      if (courseId) {
        const { rows: u } = await query(`SELECT DISTINCT u.email FROM users u JOIN orders o ON u.id = o."userId" JOIN order_items oi ON o.id = oi."orderId" WHERE oi."courseId" = $1 AND o.status = 'completed'`, [courseId]);
        usersToEmail = u || [];
      } else if (eventId) {
        const { rows: u } = await query(`SELECT DISTINCT u.email FROM users u JOIN orders o ON u.id = o."userId" JOIN order_items oi ON o.id = oi."orderId" WHERE oi."eventId" = $1 AND o.status = 'completed'`, [eventId]);
        usersToEmail = u || [];
      } else {
        const { rows: u } = await query(`SELECT email FROM users`);
        usersToEmail = u || [];
      }
      
      for (const u of usersToEmail) {
        // Run in background
        sendEmail(u.email, 'notification', { title, message }).catch(console.error);
      }
      
      res.json(rows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create announcement' });
    }
  });

  app.delete('/api/admin/announcements/:id', authenticateToken, checkDb, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete announcement' });
    }
  });

  // Email Templates
  app.get('/api/admin/email-templates', authenticateToken, checkDb, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { rows } = await query('SELECT key, subject, body_html FROM email_templates ORDER BY key ASC');
      res.json(rows || []);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to fetch email templates' });
    }
  });

  app.put('/api/admin/email-templates/:key', authenticateToken, checkDb, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { subject, body_html } = req.body;
      await query('UPDATE email_templates SET subject = $1, body_html = $2 WHERE key = $3', [subject, body_html, req.params.key]);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update email template' });
    }
  });

  // User announcements - fetch based on their purchases
  app.get('/api/user/announcements', authenticateToken, checkDb, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const { rows } = await query(
        `SELECT a.*, c.title as "courseTitle", e.title_en as "eventTitle" 
         FROM announcements a
         LEFT JOIN courses c ON a."courseId" = c.id
         LEFT JOIN events e ON a."eventId" = e.id
         WHERE 
           (a."courseId" IS NOT NULL AND EXISTS (
             SELECT 1 FROM orders o 
             JOIN order_items oi ON o.id = oi."orderId" 
             WHERE o."userId" = $1 AND oi."courseId" = a."courseId"
           ))
           OR
           (a."eventId" IS NOT NULL AND EXISTS (
             SELECT 1 FROM orders o 
             JOIN order_items oi ON o.id = oi."orderId" 
             WHERE o."userId" = $1 AND oi."eventId" = a."eventId"
           ))
         ORDER BY a."createdAt" DESC`,
        [userId]
      );
      res.json(rows || []);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to fetch user announcements' });
    }
  });

  // API 404 Handler
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('GLOBAL API ERROR:', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      code: err.code
    });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('Vite middleware not loaded:', e);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

export default app;
