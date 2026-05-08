import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Facebook, Instagram, ChevronRight, CheckCircle } from 'lucide-react';
import { Event } from '../types';
import Price from '../components/Price';
import { getTranslatedField } from '../utils';
import ReviewsSection from '../components/ReviewsSection';

export default function EventDetails({ addToCart }: { addToCart?: (item: any) => void }) {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  const handleBuyTicket = () => {
    if (event?.type === 'paid' && addToCart) {
      // Create a mock Course structure from Event to fit CartItem
      const eventAsCourse = {
        ...event,
        title: getTranslatedField(event, 'title', i18n.language),
        thumbnail: event.banner,
        itemType: 'event' // so we know it's an event
      };
      addToCart(eventAsCourse);
      navigate('/checkout');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (data && !data.error) {
          setEvent(data);
          
          let purchased = false;
          const token = localStorage.getItem('token');
          if (token) {
            const myRes = await fetch('/api/my-events', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (myRes.ok) {
              const myEvents = await myRes.json();
              purchased = myEvents.some((e: Event) => e.id === data.id);
              setIsPurchased(purchased);
            }
          }
        } else {
          navigate('/events');
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-[#3B2A8F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  const eventTitle = getTranslatedField(event, 'title', i18n.language);
  const eventDesc = getTranslatedField(event, 'description', i18n.language);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header / Breadcrumbs */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/events" className="flex items-center gap-3 text-gray-400 hover:text-[#3B2A8F] transition-colors text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft size={16} />
            {t('events.backToEvents')}
          </Link>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#08678C] transition-all">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-8 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[16/9]"
              >
                <img 
                  src={event.banner || undefined} 
                  alt={eventTitle} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-8 right-8">
                  <span className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl ${event.type === 'free' ? 'bg-green-500 text-white' : 'bg-[#3B2A8F] text-white'}`}>
                    {event.type === 'free' ? t('events.free') : <Price amount={event.price || 0} />}
                  </span>
                </div>
              </motion.div>

              <div className="space-y-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight italic leading-tight"
                >
                  {eventTitle}
                </motion.h1>

                <div className="flex flex-wrap gap-10 py-10 border-y border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-[#3B2A8F] rounded-2xl flex items-center justify-center">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#08678C] mb-1">{t('events.date')}</p>
                        <p className="text-gray-900 font-bold text-sm italic">{new Date(event.eventDate).toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-[#3B2A8F] rounded-2xl flex items-center justify-center">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#08678C] mb-1">{t('events.time')}</p>
                        <p className="text-gray-900 font-bold text-sm italic">{new Date(event.eventDate).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-[#3B2A8F] rounded-2xl flex items-center justify-center">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#08678C] mb-1">{t('events.location')}</p>
                        <p className="text-gray-900 font-bold text-sm italic">{event.location}</p>
                      </div>
                   </div>
                </div>

                <div className="prose prose-lg max-w-none">
                   <p className="text-xl text-gray-600 leading-relaxed font-medium italic whitespace-pre-wrap">
                      {eventDesc}
                   </p>
                </div>
                
                {/* Reviews Section */}
                <ReviewsSection eventId={event.id} isPurchased={isPurchased} />
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/30"
                >
                  <div className="text-center mb-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('events.registration')}</p>
                    <h3 className="text-3xl font-black text-gray-900 italic">
                      {event.type === 'free' ? t('events.freeAdmission') : <Price amount={event.price || 0} />}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-10">
                    {[
                      t('events.benefits.access'),
                      t('events.benefits.materials'),
                      t('events.benefits.certification'),
                      t('events.benefits.networking'),
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-500 font-medium italic">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleBuyTicket} className="w-full bg-[#3B2A8F] text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#08678C] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-[#3B2A8F]/20">
                    {event.type === 'free' ? t('events.registerNow') : t('events.buyTicket')}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest">
                    {t('events.limitedSeats')}
                  </p>
                </motion.div>

                <div className="bg-[#08678C] p-10 rounded-[3rem] text-white overflow-hidden relative group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <Instagram size={120} />
                   </div>
                   <h4 className="text-2xl font-black italic mb-4 relative z-10">{t('events.followUpdate')}</h4>
                   <p className="text-sm text-blue-100 font-medium italic mb-8 relative z-10 leading-relaxed">
                      {t('events.socialPrompt')}
                   </p>
                   <div className="flex gap-4 relative z-10">
                      <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
                        <Instagram size={20} />
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
                        <Facebook size={20} />
                      </a>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
