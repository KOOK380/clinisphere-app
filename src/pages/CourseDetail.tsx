import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  PlayCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  Lock,
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import { Course, Module, Lesson } from "../types";
import { useTranslation } from "react-i18next";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
          // Set first lesson as active by default if available
          if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
            setActiveLesson(data.modules[0].lessons[0]);
            setExpandedModules([data.modules[0].id]);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course detail:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3A8A]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">{t('courseDetail.notFound')}</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline"
        >
          {t('courseDetail.backToDashboard')}
        </button>
      </div>
    );
  }

  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('vimeo.com/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        return `https://player.vimeo.com/video/${id}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 fixed top-0 w-full z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-black text-[#1E3A8A] tracking-tight uppercase line-clamp-1">
              {i18n.language === 'fr' 
                ? (course.title_fr || course.title_en || course.title)
                : (course.title_en || course.title_fr || course.title)}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {activeLesson ? (
                i18n.language === 'fr' 
                  ? (activeLesson.title_fr || activeLesson.title_en || activeLesson.title)
                  : (activeLesson.title_en || activeLesson.title_fr || activeLesson.title)
              ) : t('courseDetail.selectLesson')}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
               <div className="w-1/3 h-full bg-[#1E3A8A]" />
             </div>
             <span className="text-[10px] font-black text-[#1E3A8A]">33% {t('courseDetail.completed')}</span>
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row pt-[73px] min-h-screen">
        {/* Main Content (Video Player) */}
        <main className="flex-grow lg:overflow-y-auto">
          <div className="aspect-video bg-black sticky top-[73px] z-10 lg:z-0">
             {activeLesson?.videoUrl ? (
               <iframe
                src={getEmbedUrl(activeLesson.videoUrl)}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
              />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-4">
                 <PlayCircle size={64} />
                 <p className="font-black uppercase tracking-[0.2em] text-xs">{t('courseDetail.noVideo')}</p>
               </div>
             )}
          </div>

          <div className="p-8 lg:p-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {i18n.language === 'fr'
                      ? (activeLesson?.title_fr || activeLesson?.title_en || activeLesson?.title)
                      : (activeLesson?.title_en || activeLesson?.title_fr || activeLesson?.title)}
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {activeLesson?.duration || "N/A"}
                    </span>
                    <span className="flex items-center gap-1.5 text-green-500">
                      <CheckCircle size={14} />
                      {t('courseDetail.inProgress')}
                    </span>
                  </div>
               </div>
               <button className="px-8 py-3 bg-[#1E3A8A] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-800 transition-all hover:-translate-y-1 active:translate-y-0">
                 {t('courseDetail.markAsCompleted')}
               </button>
            </div>

            {/* Lesson Description */}
            <div className="prose prose-blue max-w-none">
               <h3 className="text-lg font-black text-[#1E3A8A] uppercase tracking-widest mb-4">{t('courseDetail.aboutLesson')}</h3>
               <p className="text-gray-500 text-lg leading-relaxed font-medium">
                 {i18n.language === 'fr'
                   ? (activeLesson?.description_fr || activeLesson?.description_en || activeLesson?.description || t('courseDetail.noDescription'))
                   : (activeLesson?.description_en || activeLesson?.description_fr || activeLesson?.description || t('courseDetail.noDescription'))}
               </p>
            </div>

            {/* Instructor Quick View */}
            <div className="bg-gray-50 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
               <img src={course.instructorImage} alt={course.instructorName} className="w-20 h-20 rounded-full object-cover shadow-xl ring-4 ring-white" />
               <div className="text-center md:text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t('courseDetail.yourInstructor')}</span>
                  <p className="text-xl font-bold text-gray-900 mb-1">{course.instructorName}</p>
                  <p className="text-sm text-gray-500 font-medium italic">{course.instructorSpecialty}</p>
               </div>
            </div>
          </div>
        </main>

        {/* Sidebar (Resources / Curriculum) */}
        <aside className="w-full lg:w-96 bg-gray-50 border-l border-gray-100 flex flex-col pt-0 lg:fixed lg:right-0 lg:top-[73px] lg:bottom-0">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={18} className="text-[#1E3A8A]" />
              {t('courseDetail.curriculum')}
            </h3>
          </div>

          <div className="flex-grow overflow-y-auto">
            {course.modules?.map((module, mIdx) => (
              <div key={module.id} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-white transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-200 group-hover:text-blue-200 transition-colors">
                      {String(mIdx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest text-left">
                      {module.title}
                    </span>
                  </div>
                  {expandedModules.includes(module.id) ? (
                    <ChevronDown size={14} className="text-gray-300" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-300" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedModules.includes(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white"
                    >
                      {module.lessons?.map((lesson, lIdx) => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center gap-4 p-5 text-left transition-all ${
                            activeLesson?.id === lesson.id
                              ? "bg-blue-50 border-r-4 border-blue-600"
                              : "hover:bg-gray-50 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                             activeLesson?.id === lesson.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-300"
                          }`}>
                            <PlayCircle size={14} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">
                              {i18n.language === 'fr'
                                ? (lesson.title_fr || lesson.title_en || lesson.title)
                                : (lesson.title_en || lesson.title_fr || lesson.title)}
                            </span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1 mt-1">
                              <Clock size={8} />
                              {lesson.duration}
                            </span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
