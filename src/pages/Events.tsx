import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types';

export default function Events() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const title = i18n.language === 'fr' 
      ? (event.title_fr || event.title_en || event.title) 
      : (event.title_en || event.title_fr || event.title);
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Hero Section */}
      <section className="relative py-32 bg-[#3B2A8F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#08678C] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-200 font-black tracking-[0.3em] uppercase text-[10px] mb-6 block"
          >
            {t('events.upcoming')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight italic leading-tight"
          >
            {t('events.title')}
          </motion.h1>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 border-b border-gray-100 bg-white sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder={t('events.search')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#3B2A8F]/20 transition-all font-medium text-sm"
              />
            </div>

            <div className="flex bg-gray-50 p-1.5 rounded-xl gap-1 w-full md:w-auto">
              {(['all', 'free', 'paid'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f 
                    ? 'bg-[#3B2A8F] text-white shadow-lg shadow-[#3B2A8F]/20' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t(`events.filter.${f}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2.5rem] h-[500px] animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-md hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={event.banner} 
                      alt={i18n.language === 'fr' ? (event.title_fr || event.title_en) : (event.title_en || event.title_fr)} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ${event.type === 'free' ? 'bg-green-500 text-white' : 'bg-[#3B2A8F] text-white'}`}>
                        {event.type === 'free' ? t('events.free') : `${event.price} DH`}
                      </span>
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="flex items-center gap-3 text-[10px] font-black text-[#08678C] uppercase tracking-widest mb-6">
                      <Calendar size={14} />
                      <span>{new Date(event.eventDate).toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight line-clamp-2 italic leading-tight">
                      {i18n.language === 'fr' ? (event.title_fr || event.title_en) : (event.title_en || event.title_fr)}
                    </h3>
                    <div className="space-y-4 mb-10">
                       <div className="flex items-center gap-3 text-gray-500 text-[11px] font-medium italic">
                         <MapPin size={14} className="text-[#3B2A8F]" />
                         <span className="line-clamp-1">{event.location}</span>
                       </div>
                       <div className="flex items-center gap-3 text-gray-500 text-[11px] font-medium italic">
                         <Clock size={14} className="text-[#3B2A8F]" />
                         <span>{new Date(event.eventDate).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </div>
                    <Link 
                      to={`/events/${event.id}`}
                      className="inline-flex items-center justify-center w-full gap-3 bg-gray-50 text-[#3B2A8F] py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#3B2A8F] hover:text-white transition-all group/btn shadow-sm"
                    >
                      {t('events.viewDetails')}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <Calendar className="mx-auto text-gray-200 mb-6" size={64} />
              <h3 className="text-2xl font-black text-gray-400 italic mb-2 uppercase tracking-tighter">{t('events.noEventsFound')}</h3>
              <p className="text-gray-400 font-medium italic">{t('events.tryDifferentFilter')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
