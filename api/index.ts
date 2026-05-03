import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import slugify from 'slugify';
import multer from 'multer';
import { supabase as db } from '../src/db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

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

async function startServer() {
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static('uploads'));
  
  // Ensure an admin user exists
  try {
    const { data: adminRows } = await db.from('users').select('*').eq('role', 'admin');
    const admin = adminRows?.[0];
    if (!admin) {
      const hashedPass = await bcrypt.hash('admin123', 10);
      await db.from('users').insert([{
        name: 'Admin',
        email: 'admin@clinisphere.com',
        password: hashedPass,
        role: 'admin'
      }]);
      console.log('Default admin created: admin@clinisphere.com / admin123');
    }
  } catch (e) {
    console.error('Initial admin check failed, db might not be ready:', e);
  }

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, specialty, city, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data: userRows, error } = await db.from('users').insert([{
        name, email, password: hashedPassword, specialty, city, phone
      }]).select('id, name, email, role');

      if (error) throw error;
      const user = userRows?.[0];

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const { data: userRows } = await db.from('users').select('*').eq('email', email);
      const user = userRows?.[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Course Routes
  app.get('/api/courses', async (req, res) => {
    try {
      const { category, level, minPrice, maxPrice, search, limit = 10, offset = 0 } = req.query;
      
      let queryBuilder = db.from('courses').select('*, instructors(name, image)').eq('isPublished', true);

      if (category) queryBuilder = queryBuilder.eq('category', category);
      if (level) queryBuilder = queryBuilder.eq('level', level);
      if (minPrice) queryBuilder = queryBuilder.gte('price', Number(minPrice));
      if (maxPrice) queryBuilder = queryBuilder.lte('price', Number(maxPrice));
      if (search) queryBuilder = queryBuilder.or(`title.ilike.%${search}%,shortDescription.ilike.%${search}%`);

      const { data: courses, error } = await queryBuilder
        .order('createdAt', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) throw error;

      // Format for frontend (flatten instructors join)
      const formattedCourses = courses?.map(c => ({
        ...c,
        instructorName: c.instructors?.name,
        instructorImage: c.instructors?.image
      }));

      res.json(formattedCourses);
    } catch (err: any) {
      console.error('DATABASE ERROR on /api/courses:', err.message);
      res.status(500).json({ error: 'Failed to fetch courses: ' + err.message });
    }
  });

  app.get('/api/courses/:slug', async (req, res) => {
    try {
      const { data: courseRows, error } = await db.from('courses')
        .select('*, creators:instructors(name, bio, image), modules(*, lessons(*))')
        .eq('slug', req.params.slug);
      
      if (error) throw error;
      const course = courseRows?.[0];

      if (!course) return res.status(404).json({ error: 'Course not found' });

      // Flatten nested joins if necessary
      const formattedCourse = {
        ...course,
        instructorName: course.creators?.name,
        instructorBio: course.creators?.bio,
        instructorImage: course.creators?.image,
        modules: course.modules?.sort((a: any, b: any) => a.order - b.order).map((m: any) => ({
          ...m,
          lessons: m.lessons?.sort((a: any, b: any) => a.order - b.order)
        })) || []
      };

      res.json(formattedCourse);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch course details' });
    }
  });

  app.post('/api/courses', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const data = req.body;
      const slug = data.slug || slugify(data.title, { lower: true, strict: true });
      
      const totalLessons = data.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;

      const { data: courseRows, error: cError } = await db.from('courses').insert([{
        title: data.title,
        slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        price: data.price,
        discountPrice: data.discountPrice,
        thumbnail: data.thumbnail,
        previewVideo: data.previewVideo,
        category: data.category,
        level: data.level,
        instructorId: data.instructorId,
        duration: data.duration,
        totalLessons,
        language: data.language,
        tags: data.tags || [],
        isFeatured: data.isFeatured ? true : false,
        isPublished: data.isPublished ? true : false
      }]).select();

      if (cError) throw cError;
      const courseId = courseRows?.[0].id;

      if (data.modules && Array.isArray(data.modules)) {
        for (let mIdx = 0; mIdx < data.modules.length; mIdx++) {
          const mod = data.modules[mIdx];
          const { data: modRows, error: mError } = await db.from('modules').insert([{
            courseId,
            title: mod.title,
            order: mIdx
          }]).select();

          if (mError) throw mError;
          const moduleId = modRows?.[0].id;

          if (mod.lessons && Array.isArray(mod.lessons)) {
            const lessonsToInsert = mod.lessons.map((lesson: any, lIdx: number) => ({
              moduleId,
              title: lesson.title,
              videoUrl: lesson.videoUrl,
              content: lesson.content,
              duration: lesson.duration,
              isFreePreview: lesson.isFreePreview ? true : false,
              order: lIdx
            }));
            const { error: lError } = await db.from('lessons').insert(lessonsToInsert);
            if (lError) throw lError;
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
      const slug = data.slug || slugify(data.title, { lower: true, strict: true });

      const { data: courseRows, error: cError } = await db.from('courses').update({
        title: data.title,
        slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        price: data.price,
        discountPrice: data.discountPrice,
        thumbnail: data.thumbnail,
        previewVideo: data.previewVideo,
        category: data.category,
        level: data.level,
        instructorId: data.instructorId,
        duration: data.duration,
        language: data.language,
        tags: data.tags || [],
        isFeatured: data.isFeatured ? true : false,
        isPublished: data.isPublished ? true : false,
        updatedAt: new Date().toISOString()
      }).eq('id', req.params.id).select();

      if (cError) throw cError;

      if (data.modules && Array.isArray(data.modules)) {
        await db.from('modules').delete().eq('courseId', req.params.id);
        for (let mIdx = 0; mIdx < data.modules.length; mIdx++) {
          const mod = data.modules[mIdx];
          const { data: modRows, error: mError } = await db.from('modules').insert([{
            courseId: req.params.id,
            title: mod.title,
            order: mIdx
          }]).select();

          if (mError) throw mError;
          const moduleId = modRows?.[0].id;

          if (mod.lessons && Array.isArray(mod.lessons)) {
            const lessonsToInsert = mod.lessons.map((lesson: any, lIdx: number) => ({
              moduleId,
              title: lesson.title,
              videoUrl: lesson.videoUrl,
              content: lesson.content,
              duration: lesson.duration,
              isFreePreview: lesson.isFreePreview ? true : false,
              order: lIdx
            }));
            await db.from('lessons').insert(lessonsToInsert);
          }
        }
      }

      res.json(courseRows?.[0]);
    } catch (error: any) {
      res.status(400).json({ error: 'Failed to update course: ' + error.message });
    }
  });

  // Settings Routes
  app.get('/api/settings', async (req, res) => {
    try {
      const { data: rows, error } = await db.from('settings').select('*');
      if (error) throw error;
      const settings: any = {};
      rows.forEach((row: any) => {
        settings[row.key] = row.value;
      });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const settings = req.body;
      for (const [key, value] of Object.entries(settings)) {
        await db.from('settings').upsert({ key, value: String(value) });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: 'Failed to update settings: ' + error.message });
    }
  });

  // Upload Route
  app.post('/api/upload', authenticateToken, upload.single('file'), (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Check if it's a slider upload or logo
    const isSlider = req.query.type === 'slider';
    const folder = isSlider ? 'slider' : 'logos';
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Slider Routes
  app.get('/api/slider', async (req, res) => {
    try {
      const { data, error } = await db.from('home_slider').select('*').order('order', { ascending: true });
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch slider items' });
    }
  });

  app.post('/api/slider', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { type, url, title, subtitle, buttonText, buttonLink, order } = req.body;
      const { data, error } = await db.from('home_slider').insert([{
        type, url, title, subtitle, buttonText, buttonLink, order: order || 0
      }]).select();
      if (error) throw error;
      res.json({ id: data?.[0].id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add slider item' });
    }
  });

  app.put('/api/slider/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { type, url, title, subtitle, buttonText, buttonLink, order, isActive } = req.body;
      const { error } = await db.from('home_slider').update({
        type, url, title, subtitle, buttonText, buttonLink, order, isActive: isActive ? true : false
      }).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update slider item' });
    }
  });

  app.delete('/api/slider/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { error, count } = await db.from('home_slider').delete({ count: 'exact' }).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Database error while deleting: ' + error.message });
    }
  });

  // Instructor Routes
  app.get('/api/instructors', async (req, res) => {
    try {
      const { data, error } = await db.from('instructors').select('*');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch instructors' });
    }
  });

  app.get('/api/instructors/:id', async (req, res) => {
    try {
      const { data: instructorRows } = await db.from('instructors').select('*').eq('id', req.params.id);
      const instructor = instructorRows?.[0];
      if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
      
      const { data: courses } = await db.from('courses').select('*').eq('instructorId', req.params.id);
      res.json({ ...(instructor as any), courses });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch instructor' });
    }
  });

  app.post('/api/instructors', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { name, specialty, bio, image } = req.body;
      const { data, error } = await db.from('instructors').insert([{
        name, specialty, bio, image
      }]).select();
      if (error) throw error;
      res.json(data?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create instructor' });
    }
  });

  app.put('/api/instructors/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      const { name, specialty, bio, image } = req.body;
      const { data, error } = await db.from('instructors')
        .update({ name, specialty, bio, image })
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      res.json(data?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update instructor' });
    }
  });

  app.delete('/api/instructors/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await db.from('instructors').delete().eq('id', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete instructor' });
    }
  });

  app.delete('/api/courses/:id', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    try {
      await db.from('courses').delete().eq('id', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete course' });
    }
  });

  // Order Routes
  app.post('/api/orders', authenticateToken, async (req: any, res) => {
    try {
      const { items, totalPrice } = req.body;

      const { data: orderRows, error: oError } = await db.from('orders').insert([{
        userId: req.user.userId,
        totalPrice
      }]).select();
      
      if (oError) throw oError;
      const orderId = orderRows?.[0].id;
      
      const orderItemsToInsert = items.map((item: any) => ({
        orderId,
        courseId: item.id,
        price: item.price
      }));
      await db.from('order_items').insert(orderItemsToInsert);
      
      res.json(orderRows?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create order' });
    }
  });

  // Contact Route
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const { data, error } = await db.from('contacts').insert([{
        name, email, message
      }]).select();
      if (error) throw error;
      res.json(data?.[0]);
    } catch (error) {
      res.status(400).json({ error: 'Failed to save message' });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { data: users } = await db.from('users').select('id, name, email, role, specialty, city, createdAt');
    res.json(users);
  });

  app.get('/api/admin/orders', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { data: orders } = await db.from('orders')
      .select('*, user:users(name, email)')
      .order('createdAt', { ascending: false });
    
    const formattedOrders = orders?.map(o => ({
      ...o,
      userName: o.user?.name,
      userEmail: o.user?.email
    }));
    res.json(formattedOrders);
  });

  app.get('/api/admin/contacts', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { data: contacts } = await db.from('contacts').select('*').order('createdAt', { ascending: false });
    res.json(contacts);
  });

  app.get('/api/admin/instructors', authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { data: instructors } = await db.from('instructors').select('*').order('name', { ascending: true });
    res.json(instructors);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // On Vercel or in production, we don't serve static files from here 
    // Vercel serves them from the root based on vercel.json rewrites or output directory
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
