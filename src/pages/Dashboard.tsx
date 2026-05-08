import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, PlayCircle, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Course, User } from '../types';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  user: User | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      // Clear cart on payment success
      localStorage.removeItem('cart');
      // Set a temporary success message (optional, you could use a state)
      // We will just clear the URL parameters so it doesn't stay there forever
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      setTimeout(() => {
        alert("Payment Successful! Thank you for your order.");
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/my-courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);

        // Fetch announcements
        const annRes = await fetch('/api/user/announcements', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (annRes.ok) {
          const annData = await annRes.json();
          setAnnouncements(Array.isArray(annData) ? annData : []);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#3B2A8F] font-black tracking-widest uppercase text-[10px] mb-4 block">{t('dashboard.badge')}</span>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {t('dashboard.welcome', { name: user.name })}
            </h1>
            <p className="text-gray-500 font-medium italic">{t('dashboard.desc')}</p>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#3B2A8F] animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{t('dashboard.loading')}</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] border border-red-100 text-center">
            <p className="font-bold">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dashboard.noCourses')}</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto italic">
              {t('dashboard.noCoursesDesc')}
            </p>
            <Link 
              to="/formations" 
              className="inline-flex items-center gap-3 bg-[#3B2A8F] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#2d1f70] transition-all"
            >
              {t('dashboard.catalogButton')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all h-full flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={course.thumbnail || undefined} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-500">
                      <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                    </div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/90 backdrop-blur-md text-[#3B2A8F] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-[#3B2A8F] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-6 mt-auto pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} />
                      <span>{course.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <BookOpen size={12} />
                      <span>{course.totalLessons || 0} {t('dashboard.lesson')}s</span>
                    </div>
                  </div>

                  <div 
                    className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest hover:bg-[#3B2A8F] transition-all shadow-lg active:scale-95 cursor-pointer"
                  >
                    {t('dashboard.continue')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {announcements.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Updates & Live Classes</h2>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col md:flex-row gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                         {ann.courseTitle ? `Course: ${ann.courseTitle}` : ann.eventTitle ? `Event: ${ann.eventTitle}` : 'General Update'}
                       </span>
                       <span className="text-xs text-gray-400 font-medium">
                         {new Date(ann.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{ann.title}</h3>
                    <div className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{ann.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
