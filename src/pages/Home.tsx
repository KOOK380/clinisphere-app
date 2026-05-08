import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle, Award, Users, BookOpen, ArrowRight, Instagram, Facebook, ChevronLeft, ChevronRight, Music, Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from "../contexts/SettingsContext";
import { SliderItem, Event, Course } from '../types';
import { getEmbedUrl, isExternalVideo, isDirectVideo, getTranslatedField } from "../utils";
import Price from '../components/Price';
import CourseCard from '../components/CourseCard';

interface HomeProps {
  onAddToCart: (course: any) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const coursesScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    ref.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    // Fetch slider
    fetch('/api/slider')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSliderItems(data.filter(item => item.isActive));
        }
      });
    
    // Fetch courses
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data.slice(0, 6)); // API already filters by isPublished
        }
      });
    
    // Fetch events
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      });
  }, []);

  useEffect(() => {
    if (sliderItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sliderItems]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);

  return (
    <div className="overflow-hidden font-sans">
      {/* Hero Section with Dynamic Slider */}
      <section className="relative h-screen min-h-[700px] bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          {sliderItems.length > 0 ? (
            <motion.div
              key={sliderItems[currentSlide].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 z-0">
                {sliderItems[currentSlide].type === "video" ||
                isExternalVideo(sliderItems[currentSlide].url) ||
                isDirectVideo(sliderItems[currentSlide].url) ? (
                  isExternalVideo(sliderItems[currentSlide].url) ? (
                    <iframe
                      src={getEmbedUrl(sliderItems[currentSlide].url) || undefined}
                      className="h-full w-full border-none object-cover"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                      src={sliderItems[currentSlide].url || undefined}
                    />
                  )
                ) : (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${sliderItems[currentSlide].url})`,
                    }}
                  />
                )}
                <div className="absolute inset-0 z-10 bg-black/40" />
              </div>

              <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto text-white pb-32 md:pb-40">


                <h1 className="text-4xl md:text-7xl font-bold mb-12 drop-shadow-lg leading-tight">
                  {sliderItems[currentSlide].title || t('home.hero.fallbackTitle')}
                </h1>

                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium italic">
                  {sliderItems[currentSlide].subtitle}
                </p>

                <div className="hidden md:flex flex-wrap justify-center gap-4">
                  {settings.sliderButton1Enabled && (
                    <Link 
                      to={settings.sliderButton1Link || "/register"} 
                      className="px-10 py-3 border-2 border-white bg-white text-[#1E3A8A] rounded-full text-lg font-bold hover:bg-white/90 transition-all shadow-lg"
                    >
                      {settings.sliderButton1Text || t('home.hero.registerBtn')}
                    </Link>
                  )}
                  {settings.sliderButton2Enabled && (
                    <Link 
                      to={settings.sliderButton2Link || "/courses"} 
                      className="px-10 py-3 border-2 border-white text-white rounded-full text-lg font-bold hover:bg-white hover:text-white transition-all shadow-lg backdrop-blur-sm bg-white/10"
                    >
                      {settings.sliderButton2Text || t('home.hero.catalogueBtn')}
                    </Link>
                  )}
                  
                  {!settings.sliderButton1Enabled && !settings.sliderButton2Enabled && (
                    <Link 
                      to={sliderItems[currentSlide].buttonLink || "/register"} 
                      className="inline-block px-10 py-3 border-2 border-white/50 bg-white/10 backdrop-blur-sm rounded-full text-lg font-medium hover:bg-white/20 transition-all"
                    >
                      {sliderItems[currentSlide].buttonText || t('home.hero.fallbackBtn')}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Fallback Static Hero */
            <div className="absolute inset-0">
               <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000")',
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto text-white pb-32 md:pb-40">

                <h1 className="text-5xl md:text-7xl font-bold mb-12 drop-shadow-lg leading-tight">
                  {t('home.hero.fallbackTitle').split('&')[0]}<br />
                  {t('home.hero.fallbackTitle').split('&')[1] ? '& ' + t('home.hero.fallbackTitle').split('&')[1] : ''}
                </h1>
                <Link to="/register" className="hidden md:inline-block px-10 py-3 border-2 border-white/50 bg-white/10 backdrop-blur-sm rounded-full text-lg font-medium hover:bg-white/20 transition-all">
                  {t('home.hero.fallbackBtn')}
                </Link>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {sliderItems.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hidden md:block">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hidden md:block">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Quick Features Row Overlay */}
        <div className="hidden md:block absolute bottom-6 md:bottom-10 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto px-2 md:px-4 text-white">
            <div className="grid grid-cols-3 gap-2 md:gap-8">
              <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-center md:text-left">
                <h3 className="text-[11px] md:text-xl font-bold mb-1 md:mb-2 leading-tight">{t('home.features.courses.title')}</h3>
                <p className="hidden md:block text-sm text-gray-200">{t('home.features.courses.desc')}</p>
              </div>
              <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-center md:text-left">
                <h3 className="text-[11px] md:text-xl font-bold mb-1 md:mb-2 leading-tight">{t('home.features.quiz.title')}</h3>
                <p className="hidden md:block text-sm text-gray-200">{t('home.features.quiz.desc')}</p>
              </div>
              <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-center md:text-left">
                <h3 className="text-[11px] md:text-xl font-bold mb-1 md:mb-2 leading-tight">{t('home.features.support.title')}</h3>
                <p className="hidden md:block text-sm text-gray-200">{t('home.features.support.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-[#F9E5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#3B2A8F] leading-snug italic mb-10">
                {t('home.intro.title')}
              </h2>
              <Link 
                to="/formations" 
                className="inline-block bg-[#3B2A8F] text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#2d1f70] transition-colors"
              >
                {t('home.intro.cta')}
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=1016,fit=crop/lYN1Q93r88qnxStG/neurologie-vPD8OqghrDD8QJui.png" 
                alt="Neurologie" 
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Formations Section (Upcoming Courses) */}
      <section className="py-24 bg-[#3B2A8F] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tight">{t('home.upcoming.title')}</h2>
          <p className="text-blue-200 text-lg mb-20 italic">{t('home.upcoming.subtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* card 1 */}
            <div className="flex flex-col">
              <div className="bg-[#F9E5D9] text-[#3B2A8F] font-bold py-2 px-4 md:px-10 rounded-t-3xl border-b-2 border-[#3B2A8F] self-center -mb-px relative z-10 min-w-[200px] md:min-w-[240px] max-w-full text-center uppercase text-sm">
                {t('home.upcoming.colpo.tag')}
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full text-black">
                <div className="h-[300px] relative">
                  <img src="https://hkbkvnaptnhkoghuredj.supabase.co/storage/v1/object/public/media/1.png" alt="Colposcopie" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-2 px-4 shadow-inner">
                    <p className="text-[#3B2A8F] font-bold text-sm">Professeur Nawel MERROUCHE</p>
                  </div>
                </div>
                <div className="p-8 flex-grow text-left">
                  <h3 className="text-[#3B2A8F] text-2xl font-bold mb-6 leading-tight uppercase">{t('home.upcoming.colpo.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {t('home.upcoming.colpo.desc')}
                  </p>
                  <div className="mt-auto flex justify-end">
                    <Link to="/formations" className="px-6 py-2 bg-gray-50 border border-gray-100 rounded-full text-[#3B2A8F] font-bold text-xs hover:bg-gray-100 italic">
                      {t('home.upcoming.details')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* card 2 */}
            <div className="flex flex-col">
              <div className="bg-[#F9E5D9] text-[#3B2A8F] font-bold py-2 px-4 md:px-10 rounded-t-3xl border-b-2 border-[#3B2A8F] self-center -mb-px relative z-10 min-w-[200px] md:min-w-[240px] max-w-full text-center uppercase text-sm">
                {t('home.upcoming.prolapsus.tag')}
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full text-black">
                <div className="h-[300px] relative">
                  <img src="https://hkbkvnaptnhkoghuredj.supabase.co/storage/v1/object/public/media/2.png" alt="Prolapsus" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-2 px-4 shadow-inner">
                    <p className="text-[#3B2A8F] font-bold text-sm">Professeur Hervé FERNANDEZ.</p>
                  </div>
                </div>
                <div className="p-8 flex-grow text-left">
                  <h3 className="text-[#3B2A8F] text-xl font-bold mb-6 leading-tight uppercase">{t('home.upcoming.prolapsus.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {t('home.upcoming.prolapsus.desc')}
                  </p>
                  <div className="mt-auto flex justify-end">
                    <Link to="/formations" className="px-6 py-2 bg-gray-50 border border-gray-100 rounded-full text-[#3B2A8F] font-bold text-xs hover:bg-gray-100 italic">
                      {t('home.upcoming.details')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* card 3 */}
            <div className="flex flex-col">
              <div className="bg-[#F9E5D9] text-[#3B2A8F] font-bold py-2 px-4 md:px-10 rounded-t-3xl border-b-2 border-[#3B2A8F] self-center -mb-px relative z-10 min-w-[200px] md:min-w-[240px] max-w-full text-center uppercase text-sm">
                {t('home.upcoming.hystero.tag')}
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full text-black">
                <div className="h-[300px] relative">
                  <img src="https://hkbkvnaptnhkoghuredj.supabase.co/storage/v1/object/public/media/3.png" alt="Hysteroscopie" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-2 px-4 shadow-inner">
                    <p className="text-[#3B2A8F] font-bold text-sm">Professeur Michel COSSON</p>
                  </div>
                </div>
                <div className="p-8 flex-grow text-left">
                  <h3 className="text-[#3B2A8F] text-2xl font-bold mb-6 leading-tight uppercase">{t('home.upcoming.hystero.title')}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                    {t('home.upcoming.hystero.desc')}
                  </p>
                  <div className="mt-auto flex justify-end">
                    <Link to="/formations" className="px-6 py-2 bg-gray-50 border border-gray-100 rounded-full text-[#3B2A8F] font-bold text-xs hover:bg-gray-100 italic">
                      {t('home.upcoming.details')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:justify-between md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#3B2A8F] font-black tracking-widest uppercase text-[10px] mb-4 block">{t('formations.badge')}</span>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight italic mb-4">{t('formations.title')}</h2>
              <p className="text-gray-400 font-medium italic">{t('formations.desc')}</p>
            </div>
            <Link to="/formations" className="flex items-center gap-3 text-[#3B2A8F] font-black uppercase text-[11px] tracking-widest group bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all">
              {t('events.all')} {/* using the same 'ALL' generic button text layout translated */}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative group">
            {courses.length > 0 ? (
              <div 
                ref={coursesScrollRef}
                onMouseDown={(e) => handleMouseDown(e, coursesScrollRef)}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={(e) => handleMouseMove(e, coursesScrollRef)}
                className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar overscroll-x-contain cursor-grab active:cursor-grabbing" 
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex-shrink-0 w-[85%] md:w-[380px] snap-center md:snap-start"
                  >
                    <CourseCard course={course} onAddToCart={onAddToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                <BookOpen className="mx-auto text-gray-200 mb-6" size={48} />
                <h3 className="text-xl font-black text-gray-400 italic mb-2 uppercase tracking-tight">{t('formations.title')}</h3>
              </div>
            )}
            
            {/* Scroll indicator for mobile */}
            {courses.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 md:hidden">
                {courses.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:justify-between md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#3B2A8F] font-black tracking-widest uppercase text-[10px] mb-4 block">{t('events.upcoming')}</span>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight italic mb-4">{t('events.title')}</h2>
              <p className="text-gray-400 font-medium italic">{t('navbar.eventsSubtitle')}</p>
            </div>
            <Link to="/events" className="flex items-center gap-3 text-[#3B2A8F] font-black uppercase text-[11px] tracking-widest group bg-gray-50 px-6 py-3 rounded-full hover:bg-gray-100 transition-all">
              {t('events.all')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative group">
            {events.length > 0 ? (
              <div 
                ref={scrollRef}
                onMouseDown={(e) => handleMouseDown(e, scrollRef)}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={(e) => handleMouseMove(e, scrollRef)}
                className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar overscroll-x-contain cursor-grab active:cursor-grabbing" 
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {events.map((event, i) => (
                  <div
                    key={event.id}
                    className="flex-shrink-0 w-[85%] md:w-[380px] snap-center md:snap-start group/card"
                  >
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-md hover:shadow-2xl transition-all overflow-hidden h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          draggable={false}
                          src={event.banner || undefined} 
                          alt={getTranslatedField(event, 'title', i18n.language)} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 pointer-events-none"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${event.type === 'free' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {event.type === 'free' ? t('events.free') : <Price amount={event.price || 0} />}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="flex items-center gap-3 text-[9px] font-bold text-[#08678C] uppercase tracking-widest mb-4">
                          <Calendar size={12} />
                          <span>{new Date(event.eventDate).toLocaleDateString(i18n.language, { month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight line-clamp-2 italic leading-tight">
                          {getTranslatedField(event, 'title', i18n.language)}
                        </h3>
                        <div className="flex flex-col gap-3 mb-8">
                           <div className="flex items-center gap-3 text-gray-400 text-[10px] italic">
                             <MapPin size={12} className="text-[#3B2A8F]" />
                             <span className="line-clamp-1">{event.location}</span>
                           </div>
                           <div className="flex items-center gap-3 text-gray-400 text-[10px] italic">
                             <Clock size={12} className="text-[#3B2A8F]" />
                             <span>{new Date(event.eventDate).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </div>
                        <Link 
                          to={`/events/${event.id}`}
                          className="mt-auto inline-flex items-center justify-center w-full gap-2 bg-gray-50 text-[#3B2A8F] py-4 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#3B2A8F] hover:text-white transition-all shadow-sm"
                        >
                          {t('events.viewDetails')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <Calendar className="mx-auto text-gray-200 mb-6" size={48} />
                <h3 className="text-xl font-black text-gray-400 italic mb-2 uppercase tracking-tight">{t('events.noEventsFound')}</h3>
                <p className="text-gray-400 text-sm italic font-medium">{t('events.tryDifferentFilter')}</p>
              </div>
            )}
            
            {/* Scroll indicator for mobile */}
            {events.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 md:hidden">
                {events.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

