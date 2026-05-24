import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, PlayCircle, Clock, GraduationCap, CheckCircle, ChevronDown, ChevronRight, ShoppingCart } from 'lucide-react';
import { Course, Lesson } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { getTranslatedField } from '../utils';
import ReviewsSection from '../components/ReviewsSection';
import Price from '../components/Price';

interface CourseDetailProps {
  onAddToCart?: (course: Course) => void;
}

export default function CourseDetail({ onAddToCart }: CourseDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Mock Fetching course
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${slug}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('Course not found');
        const data = await res.json();
        const courseData = data.course || data;
        setCourse(courseData);
        setIsPurchased(data.isPurchased || false);
        setOrderStatus(data.orderStatus || null);
        
        if (courseData.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(courseData.modules[0].lessons[0]);
          setOpenModules({ [courseData.modules[0].id]: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const toggleModule = (id: string) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const isVimeo = url.includes('vimeo.com');
      if (isVimeo) {
        const parts = url.split('/');
        const id = parts[parts.length - 1].split('?')[0];
        return `https://player.vimeo.com/video/${id}`;
      }
      const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
      if (isYoutube) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
          // Sometimes watch?v=... has other query params
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtube.com/embed/')) {
          return url;
        } else if (url.includes('youtube.com/shorts/')) {
          videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/live/')) {
          videoId = url.split('youtube.com/live/')[1]?.split('?')[0];
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      return url;
    } catch {
       return url;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center pt-20">Course not found</div>;

  const handleAddToCart = () => {
    if (onAddToCart && course) {
      onAddToCart(course);
      navigate('/cart');
    }
  };

  if (!isPurchased) {
    const whatsappBaseUrl = settings?.floating_chat_url || (settings?.contact_phone ? `https://wa.me/${settings.contact_phone.replace(/\D/g, '')}` : "https://wa.me/");
    const msg = encodeURIComponent(`Hello, I'm interested in the course: ${getTranslatedField(course, 'title', 'en')}`);
    const finalWhatsappLink = whatsappBaseUrl.includes('?') ? `${whatsappBaseUrl}&text=${msg}` : `${whatsappBaseUrl}?text=${msg}`;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-[73px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column - Image */}
          <div className="w-full relative h-[600px]">
            <img 
              src={course.thumbnail} 
              alt={getTranslatedField(course, 'title', i18n.language)}
              className="w-full h-full object-cover rounded-[3rem] shadow-xl"
            />
          </div>
          
          {/* Right Column - Details */}
          <div className="w-full flex flex-col justify-center">

            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight italic leading-none">
              {getTranslatedField(course, 'title', i18n.language)}
            </h1>
            
            {course.instructorName && (
              <div className="flex items-center gap-4 mb-8">
                {course.instructorImage && (
                  <img src={course.instructorImage} alt={course.instructorName} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Instructor</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    Dr. {course.instructorName}
                  </h2>
                </div>
              </div>
            )}
            
            <div className="text-2xl font-black text-[#1E3A8A] mb-8">
              <Price amount={course.price} />
            </div>

            <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-10 pb-8 border-b border-gray-200 flex-wrap">
              {course.category && <span>Category: {course.category}</span>}
              {course.level && <span>• Level: {course.level}</span>}
              {course.duration && <span>• Duration: {course.duration}</span>}
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
              <button 
                onClick={orderStatus === 'pending' ? undefined : handleAddToCart}
                disabled={orderStatus === 'pending'}
                className={`${orderStatus === 'pending' ? 'bg-orange-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide transition-colors flex-1 shadow-md hover:shadow-xl text-center`}
              >
                {orderStatus === 'pending' ? 'Order Pending Approval' : 'Add to cart'}
              </button>
              <button 
                onClick={() => window.open(finalWhatsappLink, '_blank')}
                className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#1DA851] transition-colors flex-1 shadow-md hover:shadow-xl text-center flex items-center justify-center gap-2"
              >
                Chat on WhatsApp
              </button>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium mb-12">
               <div className="whitespace-pre-wrap">{getTranslatedField(course, 'fullDescription', i18n.language) || getTranslatedField(course, 'description', i18n.language) || getTranslatedField(course, 'shortDescription', i18n.language)}</div>
            </div>

            {course.modules && course.modules.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-12">
                <h3 className="text-2xl font-black text-gray-900 mb-8 italic tracking-tight text-[#1E3A8A]">Curriculum</h3>
                <div className="space-y-6">
                  {course.modules.map((mod, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                      <h4 className="font-bold text-lg text-gray-900 mb-4">{getTranslatedField(mod, 'title', i18n.language)}</h4>
                      {mod.lessons && mod.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-4 text-gray-600 mb-4 last:mb-0">
                          <span className="w-2 h-2 rounded-full bg-[#3B2A8F] shrink-0 mt-2" />
                          <div>
                            <span className="font-medium block text-gray-800">{getTranslatedField(lesson, 'title', i18n.language)}</span>
                            {lesson.description && <span className="text-sm text-gray-500 block mt-1">{lesson.description}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.tags && Array.isArray(course.tags) && course.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {course.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs font-bold text-[#3B2A8F] bg-[#3B2A8F]/10 px-4 py-2 rounded-full uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[73px]">
      <header className="bg-[#1E3A8A] text-white p-6 sticky top-0 z-30 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold truncate pr-4">{getTranslatedField(course, 'title', i18n.language)}</h1>
        <button onClick={() => navigate('/formations')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold uppercase tracking-widest shrink-0 transition-colors">
          Back
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Main Content (Video Player) */}
        <main className="flex-1 w-full min-w-0 lg:border-r border-gray-200 bg-white">
          <div className="w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
             {activeLesson?.videoUrl && (isPurchased || activeLesson?.isFreePreview) ? (
               <iframe
                src={getEmbedUrl(activeLesson.videoUrl)}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
              />
             ) : isPurchased ? (
               <div className="relative w-full h-full flex flex-col items-center justify-center text-white gap-4 bg-gray-900 border-b border-gray-800">
                 <Lock size={48} className="text-gray-500 mb-2" />
                 <h3 className="font-bold text-2xl tracking-tight">No Video Available</h3>
                 <p className="text-gray-400 max-w-sm text-center px-4">There is no video format provided for this specific lesson currently.</p>
               </div>
             ) : (
               <div className="relative w-full h-full flex flex-col items-center justify-center text-white gap-4 bg-gray-900 border-b border-gray-800">
                 <Lock size={48} className="text-gray-500 mb-2" />
                 <h3 className="font-bold text-2xl tracking-tight">Unlock Full Access</h3>
                 <p className="text-gray-400 max-w-sm text-center px-4">Enroll in this course to immediately unlock this lesson.</p>
                 <button 
                   onClick={() => navigate('/boutique')}
                   className="mt-4 px-8 py-3 bg-[#FF6B6B] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#ff5252] transition-colors"
                 >
                   Enroll Now
                 </button>
               </div>
             )}
          </div>

          <div className="p-8 md:p-12 space-y-8">
             <div className="border-b border-gray-100 pb-8">
                <h2 className="text-3xl md:text-4xl font-black text-[#1E3A8A] tracking-tight mb-4">
                  {getTranslatedField(activeLesson, 'title', i18n.language) || getTranslatedField(course, 'title', i18n.language)}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock size={14} /> {activeLesson?.duration || course.duration || "N/A"}</span>
                  <span className="flex items-center gap-1"><GraduationCap size={14} /> {course.level || "All Levels"}</span>
                </div>
             </div>
             
             <div className="prose max-w-none text-gray-700">
               <div className="whitespace-pre-wrap">{getTranslatedField(activeLesson, 'description', i18n.language)}</div>
             </div>

             <ReviewsSection courseId={course.id} isPurchased={isPurchased} />
          </div>
        </main>

        {/* Sidebar (Curriculum) */}
        <aside className="w-full lg:w-96 bg-gray-50 flex flex-col border-l border-gray-200 shrink-0 lg:h-[calc(100vh-140px)] lg:sticky lg:top-[140px]">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm flex items-center gap-2">
              <GraduationCap size={18} className="text-[#1E3A8A]" />
              Curriculum
            </h3>
          </div>
          <div className="flex-grow overflow-y-auto bg-gray-50">
            {course.modules?.map((module, mIdx) => (
              <div key={module.id} className="border-b border-gray-200 last:border-b-0 bg-white">
                <button
                  onClick={() => toggleModule(module.id.toString())}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-300 group-hover:text-blue-300 transition-colors">
                      {String(mIdx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-gray-900 group-hover:text-[#1E3A8A] transition-colors text-left uppercase tracking-tight">
                      {module.title}
                    </span>
                  </div>
                  {openModules[module.id] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </button>

                {openModules[module.id] && (
                  <div className="bg-gray-50 border-t border-gray-100 p-2">
                    {module.lessons?.map((lesson) => {
                      const isLocked = !isPurchased && !lesson.isFreePreview;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center gap-4 p-4 text-left transition-all rounded-xl mb-1 ${
                            activeLesson?.id === lesson.id
                              ? "bg-blue-100/50"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            activeLesson?.id === lesson.id ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-400"
                          }`}>
                            {isLocked ? <Lock size={12} /> : <PlayCircle size={12} />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <span className={`text-sm font-bold block truncate ${activeLesson?.id === lesson.id ? "text-blue-900" : "text-gray-700"}`}>
                              {getTranslatedField(lesson, 'title', i18n.language)}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lesson.duration || "N/A"}</span>
                              {lesson.isFreePreview && !isPurchased && (
                                <span className="text-[9px] font-black text-white bg-green-500 px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
