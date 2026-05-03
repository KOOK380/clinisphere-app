import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle, Award, Users, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Course, Instructor, SliderItem } from '../types';
import CourseCard from '../components/CourseCard';
import { useTranslation } from 'react-i18next';
import { getEmbedUrl, isExternalVideo, isDirectVideo } from "../utils";
import { useSettings } from "../contexts/SettingsContext";

interface HomeProps {
  onAddToCart: (course: Course) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();
  const { settings } = useSettings();

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
          setCourses(data.slice(0, 3));
        } else {
          setCourses([]);
        }
      });

    // Fetch instructors
    fetch('/api/instructors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInstructors(data.slice(0, 2));
        }
      });
  }, []);

  useEffect(() => {
    if (sliderItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [sliderItems]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);

  return (
    <div className="overflow-hidden">
      {/* Dynamic Hero Slider */}
      <section className="relative h-[90vh] overflow-hidden bg-black">
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
              {/* Background */}
              <div className="absolute inset-0 z-0">
                {sliderItems[currentSlide].type === "video" ||
                isExternalVideo(sliderItems[currentSlide].url) ||
                isDirectVideo(sliderItems[currentSlide].url) ? (
                  isExternalVideo(sliderItems[currentSlide].url) ? (
                    <iframe
                      src={getEmbedUrl(sliderItems[currentSlide].url)}
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
                      src={sliderItems[currentSlide].url}
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
                <div className="absolute inset-0 z-10 bg-black/50" />
              </div>

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="inline-block px-4 py-1.5 mb-8 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-[10px] uppercase tracking-[0.3em] font-bold">
                    {t('home.badge')}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] md:leading-[1] tracking-tight">
                    {sliderItems[currentSlide].title || t('home.title')}
                  </h1>
                  <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium">
                    {sliderItems[currentSlide].subtitle}
                  </p>
                  
                  <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                    {settings.sliderButton1Enabled && (
                      <Link
                        to={settings.sliderButton1Link || "/register"}
                        className="w-full transform rounded-full bg-[#3B2A8F] px-12 py-5 text-lg font-black uppercase tracking-wider text-white shadow-2xl transition-all hover:bg-[#4B3ABF] hover:scale-105 sm:w-auto"
                      >
                        {settings.sliderButton1Text || t("home.registerCta")}
                      </Link>
                    )}
                    {settings.sliderButton2Enabled && (
                      <Link
                        to={settings.sliderButton2Link || "/formations"}
                        className="w-full rounded-full border border-white/30 bg-white/10 px-12 py-5 text-lg font-black uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
                      >
                        {settings.sliderButton2Text || t("home.catalogueCta")}
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Fallback Static Hero if no slider items */
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1E3A8A] to-[#3B2A8F]" />
              <div className="mx-auto max-w-5xl px-4 text-center">
                <h1 className="mb-8 text-4xl font-black md:text-6xl">
                  {t("home.title")}
                </h1>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {settings.sliderButton1Enabled && (
                    <Link
                      to={settings.sliderButton1Link || "/register"}
                      className="rounded-full bg-white px-8 py-3 font-bold text-[#3B2A8F]"
                    >
                      {settings.sliderButton1Text}
                    </Link>
                  )}
                  {settings.sliderButton2Enabled && (
                    <Link
                      to={settings.sliderButton2Link || "/formations"}
                      className="rounded-full border border-white px-8 py-3 font-bold text-white"
                    >
                      {settings.sliderButton2Text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {sliderItems.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hidden md:block"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hidden md:block"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {sliderItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-1 h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0 rounded-full" />
        </div>
      </section>

      {/* Feature Blocks (Overlaid Pattern) */}
      <section className="relative z-30 -mt-12 md:-mt-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-6">
          {[
            { icon: BookOpen, title: t('home.features.video.title'), desc: t('home.features.video.desc'), bg: 'bg-blue-50' },
            { icon: Award, title: t('home.features.interactive.title'), desc: t('home.features.interactive.desc'), bg: 'bg-purple-50' },
            { icon: Users, title: t('home.features.support.title'), desc: t('home.features.support.desc'), bg: 'bg-amber-50' }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 flex-1 max-w-full md:max-w-[380px] group transition-all duration-500"
            >
              <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-8 h-8 text-[#3B2A8F]" />
              </div>
              <h3 className="text-2xl font-black text-[#3B2A8F] mb-4 tracking-tighter uppercase">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-32 bg-[#3B2A8F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-15deg] transform translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-blue-300 font-black tracking-[0.3em] uppercase text-[10px] mb-6 block">{t('home.instructors.badge')}</span>
              <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1] tracking-tight">{t('home.instructors.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">{t('home.instructors.titleAccent')}</span></h2>
              <p className="text-xl text-blue-100/60 mb-12 leading-relaxed font-medium">
                {t('home.instructors.desc')}
              </p>
              <div className="space-y-6">
                {instructors.map((inst, i) => (
                  <Link 
                    to={`/instructors/${inst.id}`}
                    key={i} 
                  >
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-6 p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 group mb-4"
                    >
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden group-hover:bg-[#3B2A8F] transition-colors shadow-xl">
                        <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight">{inst.name}</h4>
                        <p className="text-blue-200/60 text-sm font-bold uppercase tracking-wider">{inst.specialty}</p>
                        <p className="text-[10px] text-blue-300 mt-2 uppercase font-black tracking-[0.2em] line-clamp-1">{inst.bio}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1000" 
                  alt="Medical training"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-full h-full bg-[#4B3ABF]/30 rounded-[3rem] -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar (Bottom Content Bar style) */}
      <div className="bg-white border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#3B2A8F]/50 font-black mb-3">{t('home.stats.instructors')}</p>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 shadow-md"></div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-[#3B2A8F] tracking-tighter">15k+</p>
              <p className="text-[10px] text-[#3B2A8F]/40 font-black uppercase tracking-widest mt-1">{t('home.stats.doctors')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <span className="text-[#3B2A8F]/30 font-black text-[10px] uppercase tracking-[0.3em]">{t('home.stats.secure')}</span>
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-[#3B2A8F] shadow-lg shadow-[#3B2A8F]/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Formations Section */}
      <section className="py-24 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-[#3B2A8F] mb-4 tracking-tighter uppercase">{t('home.upcoming.title')}</h2>
              <p className="text-gray-400 text-lg font-medium">{t('home.upcoming.desc')}</p>
            </div>
            <Link to="/formations" className="flex items-center space-x-2 text-[#3B2A8F] font-black text-[10px] uppercase tracking-widest hover:underline group">
              <span>{t('home.upcoming.viewAll')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#3B2A8F] to-[#2d1f70] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl shadow-[#3B2A8F]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">{t('home.cta.title')}</h2>
              <p className="text-blue-100/60 text-lg mb-10 max-w-2xl mx-auto font-medium">
                {t('home.cta.desc')}
              </p>
              <Link to="/register" className="inline-block bg-white text-[#3B2A8F] px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95">
                {t('home.cta.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
