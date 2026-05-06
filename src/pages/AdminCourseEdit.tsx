import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import AdminLayout from "../components/AdminLayout";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Video,
  Clock,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Course, Module, Lesson, Instructor, AppSettings } from "../types";
import toast from "react-hot-toast";

const AdminCourseEdit = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: 0,
    discountPrice: 0,
    category: "",
    level: "beginner",
    instructorId: 0,
    duration: "",
    thumbnail: "",
    modules: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [instructorsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/instructors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/settings"),
      ]);

      const instructorsData = await instructorsRes.json();
      const settingsData = await settingsRes.json();

      setInstructors(instructorsData);
      setSettings(settingsData);

      if (id && id !== "new") {
        const courseRes = await fetch(`/api/courses/${id}`);
        if (courseRes.ok) {
          const course = await courseRes.json();
          setCourseData(course);
        } else {
          toast.error(t('admin.courses.loadError'));
          navigate("/admin");
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(t('admin.articles.errorConn'));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = id === "new" ? "/api/courses" : `/api/courses/${courseData.id}`;
      const method = id === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (res.ok) {
        toast.success(id === "new" ? t('admin.courses.successCreate') : t('admin.courses.successUpdate'));
        navigate("/admin");
      } else {
        const data = await res.json();
        toast.error(data.error || t('admin.articles.errorSave'));
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(t('admin.articles.errorConn'));
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: Date.now(),
      courseId: courseData.id || 0,
      title: "Nouveau Module",
      order: courseData.modules?.length || 0,
      lessons: [],
    };
    setCourseData({
      ...courseData,
      modules: [...(courseData.modules || []), newModule],
    });
  };

  const removeModule = (index: number) => {
    const newModules = [...(courseData.modules || [])];
    newModules.splice(index, 1);
    setCourseData({ ...courseData, modules: newModules });
  };

  const updateModuleTitle = (index: number, title: string) => {
    const newModules = [...(courseData.modules || [])];
    newModules[index].title = title;
    setCourseData({ ...courseData, modules: newModules });
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
      id: Date.now(),
      moduleId: courseData.modules![moduleIndex].id,
      title: "Nouvelle Leçon",
      description: "",
      videoUrl: "",
      duration: "",
      order: courseData.modules![moduleIndex].lessons?.length || 0,
    };
    const newModules = [...(courseData.modules || [])];
    newModules[moduleIndex].lessons = [
      ...(newModules[moduleIndex].lessons || []),
      newLesson,
    ];
    setCourseData({ ...courseData, modules: newModules });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...(courseData.modules || [])];
    newModules[moduleIndex].lessons!.splice(lessonIndex, 1);
    setCourseData({ ...courseData, modules: newModules });
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: any
  ) => {
    const newModules = [...(courseData.modules || [])];
    (newModules[moduleIndex].lessons![lessonIndex] as any)[field] = value;
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          setCourseData({ ...courseData, thumbnail: data.url });
          toast.success(t('admin.common.uploadSuccess') || "Image téléchargée");
        } else {
          toast.error(data.error || t('admin.common.uploadError') || "Erreur lors du téléchargement");
        }
      } catch (error) {
        toast.error(t('admin.articles.errorConn'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {id === "new" ? t('admin.courses.newCourse') : t('admin.courses.editCourse')}
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="px-6 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-white transition-all"
            >
              {t('admin.common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20"
            >
              <Save size={18} />
              {t('admin.common.save')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Bilingual Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* French Column */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">FR</div>
                <span className="text-sm font-black uppercase text-blue-600 tracking-widest">{t('admin.common.frContent')}</span>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.title')} (FR)</label>
                <input
                  type="text"
                  required
                  value={courseData.title_fr || ""}
                  onChange={(e) => setCourseData({ ...courseData, title_fr: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  placeholder="Titre en français"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.courses.shortDescription')} (FR)</label>
                <input
                  type="text"
                  required
                  value={courseData.shortDescription_fr || ""}
                  onChange={(e) => setCourseData({ ...courseData, shortDescription_fr: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.courses.fullDescription')} (FR)</label>
                <textarea
                  required
                  rows={6}
                  value={courseData.fullDescription_fr || ""}
                  onChange={(e) => setCourseData({ ...courseData, fullDescription_fr: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* English Column */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">EN</div>
                <span className="text-sm font-black uppercase text-blue-600 tracking-widest">{t('admin.common.enContent')}</span>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.title')} (EN)</label>
                <input
                  type="text"
                  value={courseData.title_en || ""}
                  onChange={(e) => setCourseData({ ...courseData, title_en: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  placeholder="Course title in English"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.courses.shortDescription')} (EN)</label>
                <input
                  type="text"
                  value={courseData.shortDescription_en || ""}
                  onChange={(e) => setCourseData({ ...courseData, shortDescription_en: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.courses.fullDescription')} (EN)</label>
                <textarea
                  rows={6}
                  value={courseData.fullDescription_en || ""}
                  onChange={(e) => setCourseData({ ...courseData, fullDescription_en: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                02
              </span>
              {t('admin.courses.settingsAndPricing')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.common.price')} ({settings?.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  value={courseData.price}
                  onChange={(e) =>
                    setCourseData({ ...courseData, price: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.courses.discountPrice')}
                </label>
                <input
                  type="number"
                  value={courseData.discountPrice || ""}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      discountPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.courses.category')}
                </label>
                <input
                  type="text"
                  required
                  value={courseData.category}
                  onChange={(e) =>
                    setCourseData({ ...courseData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.courses.level')}
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) =>
                    setCourseData({ ...courseData, level: e.target.value as any })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold appearance-none"
                >
                  <option value="beginner">{t('admin.courses.beginner')}</option>
                  <option value="intermediate">{t('admin.courses.intermediate')}</option>
                  <option value="advanced">{t('admin.courses.advanced')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.common.instructor')}
                </label>
                <select
                  required
                  value={courseData.instructorId}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      instructorId: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold appearance-none"
                >
                  <option value="">{t('admin.common.select')}</option>
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.courses.duration')}
                </label>
                <input
                  type="text"
                  value={courseData.duration}
                  onChange={(e) =>
                    setCourseData({ ...courseData, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  placeholder="Ex: 15h 30min"
                />
              </div>

              <div className="col-span-full">
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">
                  {t('admin.common.imageUrl')}
                </label>
                <div className="flex gap-4">
                  <input
                    type="url"
                    required
                    value={courseData.thumbnail}
                    onChange={(e) =>
                      setCourseData({ ...courseData, thumbnail: e.target.value })
                    }
                    className="flex-grow px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="relative">
                    <button
                      type="button"
                      className="bg-white p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Upload size={20} />
                    </button>
                    <input
                      type="file"
                      onChange={handleThumbnailUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                  02
                </span>
                {t('admin.courses.contentStructure')}
              </h2>
              <button
                type="button"
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
              >
                <Plus size={18} />
                {t('admin.courses.addModule')}
              </button>
            </div>

            <div className="space-y-8">
              {courseData.modules?.map((module, mIdx) => (
                <motion.div
                  key={module.id || mIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6 bg-gray-50/50 flex flex-col gap-4 relative">
                    <div className="flex items-center gap-4">
                      <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-gray-300 border border-gray-100 shrink-0">
                        {String(mIdx + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{t('admin.courses.moduleTitle')} (FR)</label>
                          <input
                            type="text"
                            value={module.title_fr || ""}
                            onChange={(e) => {
                              const newModules = [...(courseData.modules || [])];
                              newModules[mIdx].title_fr = e.target.value;
                              setCourseData({ ...courseData, modules: newModules });
                            }}
                            className="w-full bg-transparent text-lg font-black text-gray-900 border-none outline-none focus:ring-0 p-0"
                            placeholder={t('admin.courses.moduleTitle') + " (FR)"}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{t('admin.courses.moduleTitle')} (EN)</label>
                          <input
                            type="text"
                            value={module.title_en || ""}
                            onChange={(e) => {
                              const newModules = [...(courseData.modules || [])];
                              newModules[mIdx].title_en = e.target.value;
                              setCourseData({ ...courseData, modules: newModules });
                            }}
                            className="w-full bg-transparent text-lg font-black text-gray-400 border-none outline-none focus:ring-0 p-0"
                            placeholder={t('admin.courses.moduleTitle') + " (EN)"}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeModule(mIdx)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {module.lessons?.map((lesson, lIdx) => (
                      <div
                        key={lesson.id || lIdx}
                        className="p-6 rounded-2xl border border-gray-50 bg-gray-50/30 space-y-6"
                      >
                        <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4">
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.courses.lessonTitle')} (FR)</label>
                              <input
                                type="text"
                                value={lesson.title_fr || ""}
                                onChange={(e) =>
                                  updateLesson(mIdx, lIdx, "title_fr", e.target.value)
                                }
                                className="w-full bg-transparent text-lg font-bold text-gray-800 border-none outline-none focus:ring-0 p-0"
                                placeholder={t('admin.courses.lessonTitle') + " (FR)"}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.courses.lessonTitle')} (EN)</label>
                              <input
                                type="text"
                                value={lesson.title_en || ""}
                                onChange={(e) =>
                                  updateLesson(mIdx, lIdx, "title_en", e.target.value)
                                }
                                className="w-full bg-transparent text-lg font-bold text-gray-800 border-none outline-none focus:ring-0 p-0"
                                placeholder={t('admin.courses.lessonTitle') + " (EN)"}
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLesson(mIdx, lIdx)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.description')} (FR)</label>
                            <textarea
                              rows={2}
                              value={lesson.description_fr || ""}
                              onChange={(e) =>
                                updateLesson(mIdx, lIdx, "description_fr", e.target.value)
                              }
                              className="w-full bg-white px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm"
                              placeholder={t('admin.common.description') + " (FR)..."}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.description')} (EN)</label>
                            <textarea
                              rows={2}
                              value={lesson.description_en || ""}
                              onChange={(e) =>
                                updateLesson(mIdx, lIdx, "description_en", e.target.value)
                              }
                              className="w-full bg-white px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm"
                              placeholder={t('admin.common.description') + " (EN)..."}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{t('admin.courses.videoUrl')}</label>
                            <div className="relative">
                              <Video size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                              <input
                                type="text"
                                value={lesson.videoUrl || ""}
                                onChange={(e) =>
                                  updateLesson(mIdx, lIdx, "videoUrl", e.target.value)
                                }
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium"
                                placeholder={t('admin.courses.videoUrl') + "..."}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{t('admin.common.duration')}</label>
                            <div className="relative">
                              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                              <input
                                type="text"
                                value={lesson.duration || ""}
                                onChange={(e) =>
                                  updateLesson(mIdx, lIdx, "duration", e.target.value)
                                }
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium"
                                placeholder="Ex: 10:25"
                              />
                            </div>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer group">
                           <div className="relative">
                             <input 
                               type="checkbox"
                               checked={lesson.isFreePreview}
                               onChange={(e) => updateLesson(mIdx, lIdx, "isFreePreview", e.target.checked)}
                               className="sr-only"
                             />
                             <div className={`w-10 h-5 rounded-full transition-colors ${lesson.isFreePreview ? 'bg-blue-600' : 'bg-gray-200'}`} />
                             <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${lesson.isFreePreview ? 'translate-x-5' : 'translate-x-0'}`} />
                           </div>
                           <span className="text-xs font-black uppercase text-gray-400 tracking-widest group-hover:text-gray-600 transition-colors">{t('admin.courses.freePreview')}</span>
                        </label>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLesson(mIdx)}
                      className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-300 hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      {t('admin.courses.addLesson')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-12 pb-12">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-8 py-3 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-white transition-all"
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-12 py-3 bg-[#1E3A8A] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-500/20"
            >
              <Save size={20} />
              {t('admin.courses.saveCourse')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
);
};

export default AdminCourseEdit;
