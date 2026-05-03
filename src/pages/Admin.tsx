import React, { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { SettingsProvider, useSettings } from "../contexts/SettingsContext";
import {
  Users,
  BookOpen,
  ShoppingBag,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  LayoutDashboard,
  CheckCircle,
  Clock,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon,
  ArrowLeft,
  Globe,
  GraduationCap,
  Save,
  Upload,
  Video,
  FileText,
  GripVertical,
  X,
} from "lucide-react";
import { Course, User, Instructor, Module, Lesson, SliderItem } from "../types";
import { isExternalVideo, getEmbedUrl } from "../utils";

interface Order {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function Admin({ onLogout }: { onLogout: () => void }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "courses"
    | "orders"
    | "contacts"
    | "users"
    | "instructors"
    | "settings"
    | "slider"
  >("dashboard");
  const { settings, refreshSettings } = useSettings();
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );

  // Settings State
  const [settingsData, setSettingsData] = useState(settings);

  // Slider State
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SliderItem | null>(null);
  const [newSlide, setNewSlide] = useState<Partial<SliderItem>>({
    type: "image",
    url: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    order: 0,
    isActive: true,
  });

  // Data Forms
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: 0,
    discountPrice: 0,
    thumbnail: "",
    previewVideo: "",
    category: "",
    level: "beginner",
    instructorId: 0,
    duration: "",
    language: "Français",
    tags: [],
    isPublished: true,
    isFeatured: false,
    modules: [],
  });

  const [instructorData, setInstructorData] = useState({
    name: "",
    specialty: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    setSettingsData(settings);
  }, [settings]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authHeader = { Authorization: `Bearer ${token}` };

      const fetchAndSet = async (
        url: string,
        setter: (data: any) => void,
        options?: RequestInit,
      ) => {
        try {
          const res = await fetch(url, options);
          if (res.ok) {
            const data = await res.json();
            setter(Array.isArray(data) ? data : []);
          } else {
            console.warn(`Failed to fetch from ${url}: ${res.status}`);
          }
        } catch (e) {
          console.error(`Error fetching from ${url}:`, e);
        }
      };

      await Promise.all([
        fetchAndSet("/api/courses", setCourses),
        fetchAndSet("/api/admin/orders", setOrders, { headers: authHeader }),
        fetchAndSet("/api/admin/contacts", setContacts, {
          headers: authHeader,
        }),
        fetchAndSet("/api/admin/users", setUsers, { headers: authHeader }),
        fetchAndSet("/api/admin/instructors", setInstructors, {
          headers: authHeader,
        }),
        fetchAndSet("/api/slider", setSliderItems),
      ]);
    } catch (error) {
      console.error("General error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?type=slider", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setNewSlide({ ...newSlide, url: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Slider upload error:", err);
    }
  };

  const handleSubmitSlide = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingSlide ? `/api/slider/${editingSlide.id}` : "/api/slider";
    const method = editingSlide ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlide),
      });
      if (res.ok) {
        setIsAddingSlide(false);
        setEditingSlide(null);
        setNewSlide({
          type: "image",
          url: "",
          title: "",
          subtitle: "",
          buttonText: "",
          buttonLink: "",
          order: 0,
          isActive: true,
        });
        const sRes = await fetch("/api/slider");
        const sData = await sRes.json();
        setSliderItems(sData);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Operation failed");
      }
    } catch (err) {
      console.error("Submit slide error:", err);
    }
  };

  const fetchInstructors = async () => {
    const res = await fetch("/api/admin/instructors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setInstructors(Array.isArray(data) ? data : []);
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm(t("admin.common.deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (!window.confirm(t("admin.common.deleteInstructorConfirm"))) return;
    try {
      const res = await fetch(`/api/instructors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchInstructors();
    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
  };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "headerLogo" | "footerLogo",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSettingsData({ ...settingsData, [field]: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Logo upload error:", err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });
      if (res.ok) {
        alert(t("admin.settings.saveSuccess"));
        refreshSettings();
      }
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleSubmitCourse = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingCourse
      ? `/api/courses/${editingCourse.id}`
      : "/api/courses";
    const method = editingCourse ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (res.ok) {
        setIsAddingCourse(false);
        setEditingCourse(null);
        setCourseData({
          title: "",
          shortDescription: "",
          fullDescription: "",
          price: 0,
          thumbnail: "",
          category: "",
          instructorId: 0,
          modules: [],
        });
        fetchCourses();
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const addModule = () => {
    const newModule: Partial<Module> = {
      title: t("admin.courses.defaultModuleTitle"),
      order: courseData.modules?.length || 0,
      lessons: [],
    };
    setCourseData({
      ...courseData,
      modules: [...(courseData.modules || []), newModule as Module],
    });
  };

  const removeModule = (mIdx: number) => {
    const newModules = [...(courseData.modules || [])];
    newModules.splice(mIdx, 1);
    setCourseData({ ...courseData, modules: newModules });
  };

  const updateModuleTitle = (mIdx: number, title: string) => {
    const newModules = [...(courseData.modules || [])];
    newModules[mIdx].title = title;
    setCourseData({ ...courseData, modules: newModules });
  };

  const addLesson = (mIdx: number) => {
    const newLesson: Partial<Lesson> = {
      title: t("admin.courses.defaultLessonTitle"),
      order: courseData.modules?.[mIdx].lessons?.length || 0,
      isFreePreview: false,
    };
    const newModules = [...(courseData.modules || [])];
    newModules[mIdx].lessons = [
      ...(newModules[mIdx].lessons || []),
      newLesson as Lesson,
    ];
    setCourseData({ ...courseData, modules: newModules });
  };

  const removeLesson = (mIdx: number, lIdx: number) => {
    const newModules = [...(courseData.modules || [])];
    newModules[mIdx].lessons?.splice(lIdx, 1);
    setCourseData({ ...courseData, modules: newModules });
  };

  const updateLesson = (
    mIdx: number,
    lIdx: number,
    field: keyof Lesson,
    value: any,
  ) => {
    const newModules = [...(courseData.modules || [])];
    if (newModules[mIdx].lessons) {
      (newModules[mIdx].lessons![lIdx] as any)[field] = value;
    }
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleSubmitInstructor = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingInstructor
      ? `/api/instructors/${editingInstructor.id}`
      : "/api/instructors";
    const method = editingInstructor ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(instructorData),
      });

      if (res.ok) {
        setIsAddingInstructor(false);
        setEditingInstructor(null);
        setInstructorData({ name: "", specialty: "", bio: "", image: "" });
        fetchInstructors();
      }
    } catch (error) {
      console.error("Error saving instructor:", error);
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: t("admin.sidebar.dashboard"),
      icon: LayoutDashboard,
    },
    { id: "slider", label: t("admin.slider.title"), icon: Video },
    { id: "courses", label: t("admin.sidebar.courses"), icon: BookOpen },
    {
      id: "instructors",
      label: t("admin.sidebar.instructors"),
      icon: GraduationCap,
    },
    { id: "settings", label: t("admin.sidebar.settings"), icon: SettingsIcon },
    { id: "orders", label: t("admin.sidebar.orders"), icon: ShoppingBag },
    { id: "contacts", label: t("admin.sidebar.contacts"), icon: MessageSquare },
    { id: "users", label: t("admin.sidebar.users"), icon: Users },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1E3A8A]">
            {t("admin.panelTitle")}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t("admin.panelSubtitle")}
          </p>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all mb-4"
          >
            <ArrowLeft size={18} className="mr-3" />
            {t("admin.sidebar.backToSite")}
          </Link>

          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? "bg-blue-50 text-[#1E3A8A] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              id={`nav-${item.id}`}
            >
              <item.icon size={18} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
            <Globe size={16} className="text-gray-400" />
            <button
              onClick={() => changeLanguage("fr")}
              className={`text-xs font-bold ${i18n.language === "fr" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              FR
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => changeLanguage("en")}
              className={`text-xs font-bold ${i18n.language === "en" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center text-gray-500 hover:text-red-500 transition-colors w-full px-4 py-2"
          >
            <LogOut size={18} className="mr-3" />
            {t("admin.sidebar.logout")}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 mt-1">{t("admin.header.welcome")}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("settings")}
              className={`p-2 transition-colors ${activeTab === "settings" ? "text-[#1E3A8A]" : "text-gray-400 hover:text-gray-600"}`}
              id="btn-settings-header"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  label: t("admin.dashboard.totalRevenue"),
                  value: `${orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()} ${settings.currencySymbol}`,
                  icon: ShoppingBag,
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: t("admin.dashboard.activeCourses"),
                  value: courses.length,
                  icon: BookOpen,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: t("admin.dashboard.users"),
                  value: users.length,
                  icon: Users,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: t("admin.dashboard.messages"),
                  value: contacts.length,
                  icon: MessageSquare,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div
                    className={`p-3 rounded-lg ${stat.bg} ${stat.color} w-fit mb-4`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
              ))}

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t("admin.dashboard.recentOrders")}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">
                        <th className="pb-3 px-4">
                          {t("admin.common.client")}
                        </th>
                        <th className="pb-3 px-4">{t("admin.common.date")}</th>
                        <th className="pb-3 px-4">
                          {t("admin.common.amount")}
                        </th>
                        <th className="pb-3 px-4">
                          {t("admin.common.status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">
                              {order.userName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.userEmail}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                            {order.totalPrice.toLocaleString()}{" "}
                            {settings.currencySymbol}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
                              {t("admin.common.completed")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  {courses.length} {t("admin.courses.title")}
                </p>
                <button
                  onClick={() => setIsAddingCourse(true)}
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-800 transition-colors"
                  id="btn-add-course"
                >
                  <Plus size={18} className="mr-2" />
                  {t("admin.courses.addCourse")}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">{t("admin.sidebar.courses")}</th>
                      <th className="p-4">{t("admin.common.instructor")}</th>
                      <th className="p-4">{t("admin.common.price")}</th>
                      <th className="p-4">{t("admin.common.date")}</th>
                      <th className="p-4 text-right">
                        {t("admin.common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={course.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {course.title}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                                {course.shortDescription}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {(course as any).instructorName}
                        </td>
                        <td className="p-4 text-sm font-semibold text-gray-900">
                          {course.price.toLocaleString()}{" "}
                          {settings.currencySymbol}
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(course.createdAt!).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={async () => {
                              // Fetch full course with modules
                              const res = await fetch(
                                `/api/courses/${course.slug}`,
                              );
                              const fullCourse = await res.json();
                              setEditingCourse(fullCourse);
                              setCourseData(fullCourse);
                              setIsAddingCourse(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            id={`edit-${course.id}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                            id={`delete-${course.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isAddingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8"
                  >
                    <h3 className="text-xl font-bold mb-6">
                      {editingCourse
                        ? t("admin.courses.editCourse")
                        : t("admin.courses.newCourse")}
                    </h3>
                    <form onSubmit={handleSubmitCourse} className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.common.title")}
                          </label>
                          <input
                            type="text"
                            required
                            value={courseData.title}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.courses.shortDescription")}
                          </label>
                          <input
                            type="text"
                            required
                            value={courseData.shortDescription}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                shortDescription: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.courses.fullDescription")}
                          </label>
                          <textarea
                            required
                            value={courseData.fullDescription}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                fullDescription: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none h-32"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.common.price")} ({settings.currencySymbol}
                            )
                          </label>
                          <input
                            type="number"
                            required
                            value={courseData.price}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.courses.discountPrice")}
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.courses.category")}
                          </label>
                          <input
                            type="text"
                            required
                            value={courseData.category}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.courses.level")}
                          </label>
                          <select
                            value={courseData.level}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                level: e.target.value as any,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          >
                            <option value="beginner">
                              {t("admin.courses.beginner")}
                            </option>
                            <option value="intermediate">
                              {t("admin.courses.intermediate")}
                            </option>
                            <option value="advanced">
                              {t("admin.courses.advanced")}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.common.instructor")}
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          >
                            <option value="">{t("admin.common.select")}</option>
                            {instructors.map((inst) => (
                              <option key={inst.id} value={inst.id}>
                                {inst.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.courses.duration")}
                          </label>
                          <input
                            type="text"
                            value={courseData.duration}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                duration: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thumbnail (Image URL)
                          </label>
                          <input
                            type="url"
                            required
                            value={courseData.thumbnail}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                thumbnail: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-8 mt-8">
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-lg font-bold">
                            {t("admin.courses.contentStructure")}
                          </h4>
                          <button
                            type="button"
                            onClick={addModule}
                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded flex items-center hover:bg-gray-200"
                          >
                            <Plus size={14} className="mr-1" />{" "}
                            {t("admin.courses.addModule")}
                          </button>
                        </div>

                        <div className="space-y-6">
                          {courseData.modules?.map((module, mIdx) => (
                            <div
                              key={mIdx}
                              className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative"
                            >
                              <button
                                type="button"
                                onClick={() => removeModule(mIdx)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                              >
                                <X size={20} />
                              </button>
                              <div className="mb-4 pr-10">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                                  {t("admin.courses.moduleTitle")}
                                </label>
                                <input
                                  type="text"
                                  value={module.title}
                                  onChange={(e) =>
                                    updateModuleTitle(mIdx, e.target.value)
                                  }
                                  className="w-full bg-transparent text-lg font-bold border-b border-gray-300 focus:border-blue-500 outline-none pb-1"
                                />
                              </div>

                              <div className="space-y-3 ml-6">
                                {module.lessons?.map((lesson, lIdx) => (
                                  <div
                                    key={lIdx}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4"
                                  >
                                    <div className="flex-grow space-y-4">
                                      <div className="flex items-center justify-between">
                                        <input
                                          type="text"
                                          value={lesson.title}
                                          onChange={(e) =>
                                            updateLesson(
                                              mIdx,
                                              lIdx,
                                              "title",
                                              e.target.value,
                                            )
                                          }
                                          placeholder={t(
                                            "admin.courses.lessonTitle",
                                          )}
                                          className="font-semibold text-gray-800 border-none outline-none focus:ring-0 w-full"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeLesson(mIdx, lIdx)
                                          }
                                          className="text-gray-300 hover:text-red-500"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                          <Video
                                            size={14}
                                            className="text-gray-400 mr-2"
                                          />
                                          <input
                                            type="text"
                                            value={lesson.videoUrl || ""}
                                            onChange={(e) =>
                                              updateLesson(
                                                mIdx,
                                                lIdx,
                                                "videoUrl",
                                                e.target.value,
                                              )
                                            }
                                            placeholder={t(
                                              "admin.courses.videoUrl",
                                            )}
                                            className="bg-transparent text-sm w-full outline-none"
                                          />
                                        </div>
                                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                                          <Clock
                                            size={14}
                                            className="text-gray-400 mr-2"
                                          />
                                          <input
                                            type="text"
                                            value={lesson.duration || ""}
                                            onChange={(e) =>
                                              updateLesson(
                                                mIdx,
                                                lIdx,
                                                "duration",
                                                e.target.value,
                                              )
                                            }
                                            placeholder={t(
                                              "admin.courses.duration",
                                            )}
                                            className="bg-transparent text-sm w-full outline-none"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addLesson(mIdx)}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center"
                                >
                                  <Plus size={14} className="mr-1" />{" "}
                                  {t("admin.courses.addLesson")}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCourse(false);
                            setEditingCourse(null);
                          }}
                          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-bold"
                        >
                          {t("admin.common.cancel")}
                        </button>
                        <button
                          type="submit"
                          className="px-10 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/20 font-bold"
                        >
                          {t("admin.common.save")}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "instructors" && (
            <motion.div
              key="instructors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  {instructors.length} {t("admin.instructors.listed")}
                </p>
                <button
                  onClick={() => setIsAddingInstructor(true)}
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-800 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  {t("admin.instructors.addInstructor")}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">{t("admin.common.instructor")}</th>
                      <th className="p-4">{t("admin.common.specialty")}</th>
                      <th className="p-4">
                        {t("admin.instructors.dateAdded")}
                      </th>
                      <th className="p-4 text-right">
                        {t("admin.common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {instructors.map((inst) => (
                      <tr
                        key={inst.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={inst.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {inst.name}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                                {inst.bio}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {inst.specialty}
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(inst.createdAt!).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingInstructor(inst);
                              setInstructorData({
                                name: inst.name,
                                specialty: inst.specialty,
                                bio: inst.bio,
                                image: inst.image,
                              });
                              setIsAddingInstructor(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(inst.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isAddingInstructor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl w-full max-w-xl p-8"
                  >
                    <h3 className="text-xl font-bold mb-6">
                      {editingInstructor
                        ? t("admin.instructors.editInstructor")
                        : t("admin.instructors.newInstructor")}
                    </h3>
                    <form
                      onSubmit={handleSubmitInstructor}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("admin.instructors.name")}
                        </label>
                        <input
                          type="text"
                          required
                          value={instructorData.name}
                          onChange={(e) =>
                            setInstructorData({
                              ...instructorData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("admin.instructors.specialty")}
                        </label>
                        <input
                          type="text"
                          required
                          value={instructorData.specialty}
                          onChange={(e) =>
                            setInstructorData({
                              ...instructorData,
                              specialty: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("admin.instructors.bio")}
                        </label>
                        <textarea
                          required
                          value={instructorData.bio}
                          onChange={(e) =>
                            setInstructorData({
                              ...instructorData,
                              bio: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none h-24"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("admin.instructors.imageUrl")}
                        </label>
                        <input
                          type="url"
                          required
                          value={instructorData.image}
                          onChange={(e) =>
                            setInstructorData({
                              ...instructorData,
                              image: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingInstructor(false);
                            setEditingInstructor(null);
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {t("admin.common.cancel")}
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-800 transition-colors"
                        >
                          {t("admin.common.save")}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">{t("admin.common.client")}</th>
                    <th className="p-4">{t("admin.common.amount")}</th>
                    <th className="p-4">{t("admin.common.date")}</th>
                    <th className="p-4">{t("admin.common.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-sm font-mono text-gray-500">
                        #{order.id}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {order.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.userEmail}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900">
                        {order.totalPrice.toLocaleString()}{" "}
                        {settings.currencySymbol}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
                          {order.status === "pending"
                            ? t("admin.common.status")
                            : order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === "contacts" && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {contact.name}
                      </h4>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 leading-relaxed italic">
                    "{contact.message}"
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">{t("admin.common.client")}</th>
                    <th className="p-4">{t("admin.common.city")}</th>
                    <th className="p-4">{t("admin.common.specialty")}</th>
                    <th className="p-4">{t("admin.common.role")}</th>
                    <th className="p-4">{t("admin.common.registration")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {(user as any).city || t("admin.common.notSpecified")}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {(user as any).specialty ||
                          t("admin.common.notSpecified")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date((user as any).createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Currency Settings */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                    {settingsData.currencySymbol}
                  </span>
                  {t("admin.settings.currency")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("admin.settings.currencyCode")}
                    </label>
                    <input
                      type="text"
                      value={settingsData.currencyCode}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          currencyCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("admin.settings.currencySymbol")}
                    </label>
                    <input
                      type="text"
                      value={settingsData.currencySymbol}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          currencySymbol: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("admin.settings.currencyPosition")}
                    </label>
                    <div className="flex bg-gray-50 p-1 rounded-lg">
                      <button
                        onClick={() =>
                          setSettingsData({
                            ...settingsData,
                            currencyPosition: "left",
                          })
                        }
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${settingsData.currencyPosition === "left" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
                      >
                        Left ({settingsData.currencySymbol}100)
                      </button>
                      <button
                        onClick={() =>
                          setSettingsData({
                            ...settingsData,
                            currencyPosition: "right",
                          })
                        }
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${settingsData.currencyPosition === "right" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
                      >
                        Right (100 {settingsData.currencySymbol})
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Upload className="w-5 h-5 text-blue-600 mr-3" />
                  {t("admin.settings.logos")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("admin.settings.headerLogo")}
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden group relative">
                        {settingsData.headerLogo ? (
                          <img
                            src={settingsData.headerLogo}
                            alt="Header Logo"
                            className="max-w-[80%] max-h-[80%] object-contain"
                          />
                        ) : (
                          <Upload className="text-gray-300" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleLogoUpload(e, "headerLogo")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Format: SVG, PNG, JPG</p>
                        <p>Max: 5MB</p>
                        <button className="text-blue-600 font-bold hover:underline">
                          {t("admin.settings.uploadLogo")}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("admin.settings.footerLogo")}
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden group relative">
                        {settingsData.footerLogo ? (
                          <img
                            src={settingsData.footerLogo}
                            alt="Footer Logo"
                            className="max-w-[80%] max-h-[80%] object-contain"
                          />
                        ) : (
                          <Upload className="text-gray-300" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleLogoUpload(e, "footerLogo")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Format: SVG, PNG, JPG</p>
                        <p>Max: 5MB</p>
                        <button className="text-blue-600 font-bold hover:underline">
                          {t("admin.settings.uploadLogo")}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("admin.settings.logoLink")}
                    </label>
                    <input
                      type="url"
                      value={settingsData.logoLink}
                      onChange={(e) =>
                        setSettingsData({
                          ...settingsData,
                          logoLink: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center justify-center px-10 py-3 bg-[#1E3A8A] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-500/20"
                >
                  <Save className="w-5 h-5 mr-3" />
                  {t("admin.common.save")}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "slider" && (
            <motion.div
              key="slider"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Slider Global Buttons Configuration */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <LayoutDashboard className="w-5 h-5 text-blue-600 mr-3" />
                  Gestion des Boutons du Slider
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Button 1 */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-700">Bouton 1</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Activé</span>
                        <button
                          onClick={() =>
                            setSettingsData({
                              ...settingsData,
                              sliderButton1Enabled:
                                !settingsData.sliderButton1Enabled,
                            })
                          }
                          className={`w-10 h-5 rounded-full relative transition-colors ${settingsData.sliderButton1Enabled ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settingsData.sliderButton1Enabled ? "right-1" : "left-1"}`}
                          />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Texte du bouton
                      </label>
                      <input
                        type="text"
                        value={settingsData.sliderButton1Text}
                        onChange={(e) =>
                          setSettingsData({
                            ...settingsData,
                            sliderButton1Text: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white font-medium"
                        placeholder="ex: S'INSCRIRE"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Lien du bouton
                      </label>
                      <input
                        type="text"
                        value={settingsData.sliderButton1Link}
                        onChange={(e) =>
                          setSettingsData({
                            ...settingsData,
                            sliderButton1Link: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white font-medium"
                        placeholder="ex: /register"
                      />
                    </div>
                  </div>

                  {/* Button 2 */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-700">Bouton 2</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Activé</span>
                        <button
                          onClick={() =>
                            setSettingsData({
                              ...settingsData,
                              sliderButton2Enabled:
                                !settingsData.sliderButton2Enabled,
                            })
                          }
                          className={`w-10 h-5 rounded-full relative transition-colors ${settingsData.sliderButton2Enabled ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settingsData.sliderButton2Enabled ? "right-1" : "left-1"}`}
                          />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Texte du bouton
                      </label>
                      <input
                        type="text"
                        value={settingsData.sliderButton2Text}
                        onChange={(e) =>
                          setSettingsData({
                            ...settingsData,
                            sliderButton2Text: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white font-medium"
                        placeholder="ex: CATALOGUE"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Lien du bouton
                      </label>
                      <input
                        type="text"
                        value={settingsData.sliderButton2Link}
                        onChange={(e) =>
                          setSettingsData({
                            ...settingsData,
                            sliderButton2Link: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white font-medium"
                        placeholder="ex: /courses"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center px-6 py-2 bg-[#1E3A8A] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder les boutons
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <Video className="w-5 h-5 text-blue-600 mr-3" />
                    {t("admin.slider.title")}
                  </h3>
                  <button
                    onClick={() => setIsAddingSlide(true)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                  >
                    + {t("admin.slider.addItem")}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sliderItems.map((item) => (
                    <div
                      key={`slide-${item.id}`}
                      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="aspect-video bg-gray-100 relative">
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400&h=225";
                            }}
                          />
                        ) : isExternalVideo(item.url) ? (
                          <iframe
                            src={getEmbedUrl(item.url)}
                            className="w-full h-full object-cover border-none pointer-events-none"
                          />
                        ) : (
                          <video
                            src={item.url}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => e.currentTarget.pause()}
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider shadow-sm ${item.type === "video" ? "bg-orange-500 text-white" : "bg-blue-600 text-white"}`}
                          >
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 truncate mb-1">
                          {item.title || "Sans titre"}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mb-4">
                          {item.subtitle || "Aucune description"}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-400">
                              # {item.order}
                            </span>
                            <button
                              onClick={() => {
                                setEditingSlide(item);
                                setNewSlide(item);
                                setIsAddingSlide(true);
                              }}
                              className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                              title="Modifier"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              const btn = e.currentTarget;
                              const isConfirming =
                                btn.getAttribute("data-confirm") === "true";

                              if (!isConfirming) {
                                // First click - enter confirmation mode
                                btn.setAttribute("data-confirm", "true");
                                const span = btn.querySelector("span");
                                if (span) span.innerText = "CONFIRMER ?";
                                btn.classList.remove(
                                  "bg-red-50",
                                  "text-red-600",
                                );
                                btn.classList.add(
                                  "bg-orange-500",
                                  "text-white",
                                );

                                setTimeout(() => {
                                  if (btn) {
                                    btn.setAttribute("data-confirm", "false");
                                    const s = btn.querySelector("span");
                                    if (s)
                                      s.innerText =
                                        t("admin.common.delete") || "Supprimer";
                                    btn.classList.remove(
                                      "bg-orange-500",
                                      "text-white",
                                    );
                                    btn.classList.add(
                                      "bg-red-50",
                                      "text-red-600",
                                    );
                                  }
                                }, 3000);
                                return;
                              }

                              // Second click - execute deletion
                              const currentToken =
                                localStorage.getItem("token");
                              if (!currentToken) {
                                alert("Session expirée");
                                return;
                              }

                              try {
                                btn.disabled = true;
                                const res = await fetch(
                                  `/api/slider/${item.id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${currentToken}`,
                                    },
                                  },
                                );

                                if (res.ok) {
                                  setSliderItems((prev) =>
                                    prev.filter((i) => i.id !== item.id),
                                  );
                                  await fetchData(); // Refresh data to be sure
                                } else {
                                  const data = await res.json();
                                  alert(
                                    data.error ||
                                      "Erreur lors de la suppression",
                                  );
                                  btn.disabled = false;
                                }
                              } catch (err) {
                                console.error("Delete error:", err);
                                alert("Erreur réseau");
                                btn.disabled = false;
                              }
                            }}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-red-100 relative z-30"
                          >
                            <Trash2 size={16} />
                            <span className="text-xs font-bold uppercase tracking-tighter">
                              {t("admin.common.delete") || "Supprimer"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Slider Item Modal */}
        <AnimatePresence>
          {isAddingSlide && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl w-full max-w-lg p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">
                    {editingSlide
                      ? "Modifier l'élément"
                      : t("admin.slider.addItem")}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingSlide(false);
                      setEditingSlide(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitSlide} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        {t("admin.slider.type")}
                      </label>
                      <select
                        value={newSlide.type}
                        onChange={(e) =>
                          setNewSlide({
                            ...newSlide,
                            type: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                      >
                        <option value="image">{t("admin.slider.image")}</option>
                        <option value="video">{t("admin.slider.video")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        {t("admin.slider.order")}
                      </label>
                      <input
                        type="number"
                        value={newSlide.order}
                        onChange={(e) =>
                          setNewSlide({
                            ...newSlide,
                            order: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {t("admin.slider.url")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSlide.url}
                        onChange={(e) =>
                          setNewSlide({ ...newSlide, url: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        placeholder={
                          newSlide.type === "video"
                            ? "YouTube, Vimeo, ou lien direct .mp4"
                            : "URL de l'image (.jpg, .png, .svg)"
                        }
                        required
                      />
                      <div className="relative">
                        <button
                          type="button"
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                          title="Upload file"
                        >
                          <Upload size={20} />
                        </button>
                        <input
                          type="file"
                          onChange={handleSliderUpload}
                          accept="image/*,video/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    {newSlide.type === "video" && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Supporte YouTube, Vimeo et fichiers MP4 locaux.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {t("admin.common.title")}
                    </label>
                    <input
                      type="text"
                      value={newSlide.title}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      {t("admin.slider.subtitle")}
                    </label>
                    <textarea
                      value={newSlide.subtitle}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, subtitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none h-20"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSlide(false);
                        setEditingSlide(null);
                        setNewSlide({
                          type: "image",
                          url: "",
                          title: "",
                          subtitle: "",
                          buttonText: "",
                          buttonLink: "",
                          order: 0,
                          isActive: true,
                        });
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                    >
                      {t("admin.common.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-800 font-bold"
                    >
                      {t("admin.common.save")}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
