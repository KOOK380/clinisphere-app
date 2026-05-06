import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, GraduationCap, Mail, Share2, BookOpen, Clock, Users } from 'lucide-react';
import { Instructor, Course } from '../types';

import { useTranslation } from 'react-i18next';

export default function InstructorProfile() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/instructors/${id}`)
      .then(res => res.json())
      .then(data => {
        setInstructor(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching instructor:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-[#1E3A8A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-4">
        <h2 className="text-2xl font-bold mb-4">{t('instructors.notFound')}</h2>
        <Link to="/instructors" className="text-[#1E3A8A] flex items-center">
          <ChevronLeft className="mr-2" /> {t('instructors.backToList')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/instructors" className="inline-flex items-center text-gray-400 hover:text-[#1E3A8A] transition-colors mb-8 group font-medium">
          <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          {t('instructors.backToList')}
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-white mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mb-8 md:mb-0"
            >
              <img 
                src={instructor.image} 
                alt={instructor.name} 
                className="w-48 h-48 md:w-64 md:h-64 rounded-[32px] object-cover shadow-2xl ring-8 ring-blue-50"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#1E3A8A] text-white p-4 rounded-2xl shadow-xl">
                <GraduationCap size={28} />
              </div>
            </motion.div>

            <div className="md:ml-12 text-center md:text-left flex-grow">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider mb-4">
                {t('instructors.expertTag')}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1B1B1B] mb-2 tracking-tight">
                {instructor.name}
              </h1>
              <p className="text-xl text-[#3B2A8F] font-bold mb-6">{instructor.specialty}</p>
              
              <p className="text-gray-500 text-lg leading-relaxed max-w-3xl mb-8 italic">
                "{instructor.bio}"
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button className="bg-[#1E3A8A] text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95">
                  <Mail size={18} className="mr-2" />
                  {t('instructors.contact')}
                </button>
                <button className="bg-white text-[#1B1B1B] border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-gray-50 transition-all active:scale-95">
                  <Share2 size={18} className="mr-2" />
                  {t('instructors.share')}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-50 relative z-10">
            {[
              { icon: BookOpen, label: t('instructors.stats.courses'), value: instructor.courses?.length || 0 },
              { icon: Users, label: t('instructors.stats.students'), value: '1.2k+' },
              { icon: Clock, label: t('admin.common.duration'), value: '450+' },
              { icon: Share2, label: t('instructors.stats.rating'), value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start text-gray-400 mb-1">
                  <stat.icon size={16} className="mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-2xl font-black text-[#1B1B1B]">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor's Courses */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-[#1B1B1B] tracking-tight">{t('instructors.coursesBy')} {instructor.name}</h2>
            <div className="h-1 flex-grow mx-8 bg-gray-100 rounded-full hidden md:block"></div>
            <span className="text-gray-400 font-bold">{instructor.courses?.length || 0} {t('instructors.stats.courses')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructor.courses?.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group"
              >
                <Link to={`/courses/${course.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={course.thumbnail || (course as any).image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                      <span className="text-lg font-black text-[#1E3A8A]">{course.price.toLocaleString()} DH</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1E3A8A] transition-colors mb-3">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {course.shortDescription || (course as any).description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E3A8A] mr-2">
                          <BookOpen size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">En savoir plus</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                        <ChevronLeft size={20} className="rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
