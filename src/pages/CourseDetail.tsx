import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, PlayCircle, Clock, GraduationCap, CheckCircle, ChevronDown, ChevronRight, ShoppingCart } from 'lucide-react';
import { Course, Lesson } from '../types';
import { getTranslatedField } from '../utils';
import ReviewsSection from '../components/ReviewsSection';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
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
        setCourse(data.course);
        setIsPurchased(data.isPurchased);
        
        if (data.course.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(data.course.modules[0].lessons[0]);
          setOpenModules({ [data.course.modules[0].id]: true });
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
        const id = parts[parts.length - 1];
        return `https://player.vimeo.com/video/${id}`;
      }
      return url;
    } catch {
       return url;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center pt-20">Course not found</div>;

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
             ) : (
               <div className="relative w-full h-full flex flex-col items-center justify-center text-white gap-4 bg-gray-900 border-b border-gray-800">
                 <Lock size={48} className="text-gray-500 mb-2" />
                 <h3 className="font-bold text-2xl tracking-tight">Unlock Full Access</h3>
                 <p className="text-gray-400 max-w-sm text-center px-4">Enroll in this course to immediately unlock this lesson.</p>
                 {!isPurchased && (
                   <button 
                     onClick={() => navigate('/boutique')}
                     className="mt-4 px-8 py-3 bg-[#FF6B6B] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#ff5252] transition-colors"
                   >
                     Enroll Now
                   </button>
                 )}
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
                  onClick={() => toggleModule(module.id)}
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
