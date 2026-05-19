import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface FormationsProps {
  onAddToCart: (course: Course) => void;
}

export default function Formations({ onAddToCart }: FormationsProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('API returned non-array data:', data);
          setCourses([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setCourses([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 md:py-24 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-16 md:mb-24"
        >
          <span className="text-[#3B2A8F]/40 font-black tracking-[0.3em] uppercase text-[10px] block mb-4 md:mb-6">{t('formations.badge')}</span>
          <h1 className="text-3xl md:text-6xl font-black text-[#3B2A8F] mb-6 md:mb-8 tracking-tighter">{t('formations.title')}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            {t('formations.desc')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/50 h-[500px] rounded-[2.5rem] border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}

        <motion.div 
          whileHover={{ y: -5 }}
          className="mt-20 md:mt-32 p-10 md:p-16 bg-[#3B2A8F] rounded-[3rem] md:rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-15deg] transform translate-x-1/3" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{t('formations.custom.title')}</h2>
            <p className="text-blue-100/60 max-w-xl text-lg leading-relaxed font-medium">
              {t('formations.custom.desc')}
            </p>
          </div>
          <Link to="/contact" className="relative z-10 bg-white text-[#3B2A8F] px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl block w-max mt-4 md:mt-0 text-center">
            {t('formations.custom.button')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
