import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Instructor } from '../types';
import { useTranslation } from 'react-i18next';

export default function Instructors() {
  const { t } = useTranslation();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instructors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInstructors(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching instructors:', err);
        setLoading(false);
      });
  }, []);

  const filteredInstructors = instructors.filter(inst => 
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-[#1E3A8A] text-sm font-medium mb-6 border border-blue-100"
        >
          <GraduationCap size={16} className="mr-2" />
          {t('instructors.badge')}
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1B1B1B] mb-6 tracking-tight">
          {t('instructors.title')}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          {t('instructors.desc')}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" size={20} />
          <input
            type="text"
            placeholder={t('instructors.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#1E3A8A] outline-none transition-all shadow-sm group-hover:shadow-md"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl mb-6"></div>
              <div className="h-6 bg-gray-100 rounded-lg w-2/3 mb-3"></div>
              <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-6"></div>
              <div className="h-32 bg-gray-100 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInstructors.map((inst, idx) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              id={`instructor-${inst.id}`}
            >
              <Link to={`/instructors/${inst.id}`}>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img 
                      src={inst.image || undefined} 
                      alt={inst.name} 
                      className="w-24 h-24 rounded-2xl object-cover shadow-lg group-hover:rotate-3 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#1E3A8A] text-white p-1.5 rounded-lg shadow-lg">
                      <GraduationCap size={14} />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1E3A8A] transition-colors">{inst.name}</h3>
                    <p className="text-[#1E3A8A] font-semibold text-sm">{inst.specialty}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                  "{inst.bio}"
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Voir le Profil</span>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                    <Search size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
