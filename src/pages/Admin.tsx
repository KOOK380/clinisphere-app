import React, { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import AdminLayout from "../components/AdminLayout";
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
  Key,
  Shield,
  Facebook,
  Calendar,
  MapPin,
  CreditCard
} from "lucide-react";
import { Course, User, Instructor, Module, Lesson, SliderItem, Event } from "../types";
import { isExternalVideo, getEmbedUrl } from "../utils";

interface Order {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  billing_address?: string;
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
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "courses"
    | "orders"
    | "contacts"
    | "users"
    | "instructors"
    | "settings"
    | "slider"
    | "events"
    | "articles"
    | "announcements"
    | "email_templates"
  >((tabParam as any) || "dashboard");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as any);
    } else {
      setActiveTab("dashboard");
    }
  }, [tabParam]);
  const { settings, refreshSettings } = useSettings();
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

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

  // Article State
  const [articleData, setArticleData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    category: "",
    status: "published" as "published" | "draft"
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
        fetchAndSet("/api/admin/events", setEvents, {
          headers: authHeader,
        }),
        fetchAndSet("/api/admin/articles", setArticles, {
          headers: authHeader,
        }),
        fetchAndSet("/api/slider", setSliderItems),
        fetchAndSet("/api/admin/announcements", setAnnouncements, { headers: authHeader }),
        fetchAndSet("/api/admin/email-templates", setEmailTemplates, { headers: authHeader }),
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

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/events", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  };

  const fetchArticles = async () => {
    const res = await fetch("/api/admin/articles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setArticles(Array.isArray(data) ? data : []);
  };

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    courseId: "",
    eventId: "",
  });

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData(); // re-fetch data
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleCreateAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        courseId: newAnnouncement.courseId ? parseInt(newAnnouncement.courseId) : null,
        eventId: newAnnouncement.eventId ? parseInt(newAnnouncement.eventId) : null,
      };

      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAddingAnnouncement(false);
        setNewAnnouncement({ title: "", message: "", courseId: "", eventId: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm(t('admin.articles.deleteConfirm')))
      return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleSubmitArticle = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingArticle
      ? `/api/admin/articles/${editingArticle.id}`
      : "/api/admin/articles";
    const method = editingArticle ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      });

      if (res.ok) {
        setIsAddingArticle(false);
        setEditingArticle(null);
        setArticleData({
          title: "",
          excerpt: "",
          content: "",
          image: "",
          author: "",
          category: "",
          status: "published",
        });
        fetchArticles();
      }
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm(t('admin.events.deleteConfirm')))
      return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "headerLogo" | "footerLogo" | "floating_chat_custom_icon",
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
      const dataToSave = { ...settingsData };
      delete dataToSave._envStatus;

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        alert(t("admin.settings.saveSuccess"));
        refreshSettings();
      }
    } catch (err) {
      console.error("Save settings error:", err);
    }
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
    { id: "events", label: t("admin.sidebar.events"), icon: Calendar },
    { id: "articles", label: t("admin.sidebar.articles"), icon: FileText },
    {
      id: "instructors",
      label: t("admin.sidebar.instructors"),
      icon: GraduationCap,
    },
    { id: "settings", label: t("admin.sidebar.settings"), icon: SettingsIcon },
    { id: "orders", label: t("admin.sidebar.orders"), icon: ShoppingBag },
    { id: "users", label: t("admin.sidebar.users"), icon: Users },
    { id: "announcements", label: "Notifications & Meets", icon: MessageSquare },
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
    <AdminLayout onLogout={onLogout}>
      <div className="p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 mt-1">{t("admin.header.welcome")}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/admin?tab=settings")}
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
                  value: `${orders.reduce((acc, o) => acc + Number(o.totalPrice || 0), 0).toLocaleString()} ${settings.currencySymbol}`,
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
                  label: t("admin.dashboard.totalOrders"),
                  value: orders.length,
                  icon: FileText,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full overflow-hidden"
                >
                  <div
                    className={`p-3 rounded-lg ${stat.bg} ${stat.color} w-fit mb-4`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 truncate overflow-hidden" title={typeof stat.value === 'string' ? stat.value : undefined}>
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
                          {t("admin.common.statusLabel")}
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
                  onClick={() => navigate("/admin/courses/new")}
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
                            onClick={() => navigate(`/admin/courses/${course.id}`)}
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

          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  {events.length} {t("admin.sidebar.events")}
                </p>
                <button
                  onClick={() => navigate("/admin/events/new")}
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-800 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  {t('admin.sidebar.events')}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">{t('admin.events.title')}</th>
                      <th className="p-4">{t('admin.events.date')}</th>
                      <th className="p-4">{t('admin.events.type')}</th>
                      <th className="p-4">{t('admin.events.price')}</th>
                      <th className="p-4">{t('admin.events.status')}</th>
                      <th className="p-4 text-right">{t('admin.common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={event.banner}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {i18n.language === 'fr' ? event.title_fr : event.title_en}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin size={10} />
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                           <div className="flex flex-col">
                             <span className="font-medium">{new Date(event.eventDate).toLocaleDateString(i18n.language)}</span>
                             <span className="text-xs text-gray-400 font-bold">{new Date(event.eventDate).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </td>
                        <td className="p-4 text-sm">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.type === 'free' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                             {event.type}
                           </span>
                        </td>
                        <td className="p-4 text-sm font-semibold text-gray-900">
                          {event.type === 'free' ? '-' : `${event.price} ${settings.currencySymbol}`}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${event.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => navigate(`/admin/events/${event.id}`)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
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
            </motion.div>
          )}

          {activeTab === "articles" && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  {articles.length} {t('admin.sidebar.articles')}
                </p>
                <button
                  onClick={() => navigate("/admin/articles/new")}
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-800 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  {t('admin.sidebar.articles')}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4">{t('admin.articles.title')}</th>
                      <th className="p-4">{t('admin.articles.category')}</th>
                      <th className="p-4">{t('admin.articles.status')}</th>
                      <th className="p-4">{t('admin.articles.date')}</th>
                      <th className="p-4 text-right">{t('admin.common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 bg-gray-100">
                              <img src={article.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-gray-900">{article.title}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{article.category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${article.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {article.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => navigate(`/admin/articles/${article.id}`)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
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
                    <th className="p-4">{t("admin.common.statusLabel")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    let billing = null;
                    if (order.billing_address) {
                      try {
                        billing = JSON.parse(order.billing_address);
                      } catch (e) {}
                    }
                    return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
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
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                            {order.status === "pending"
                              ? (i18n.language === 'fr' ? 'En attente' : 'Pending')
                              : order.status === "completed"
                              ? t("admin.common.completed")
                              : order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {billing && (
                            <button
                              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {expandedOrderId === order.id ? "Masquer Adresse" : "Voir Adresse"}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedOrderId === order.id && billing && (
                        <tr className="bg-gray-50/50">
                          <td colSpan={6} className="p-4">
                            <div className="p-4 bg-white border border-gray-100 rounded-xl max-w-lg shadow-sm">
                              <h4 className="text-sm font-bold text-gray-900 mb-2">Adresse de Facturation</h4>
                              <p className="text-sm text-gray-600"><strong>Nom:</strong> {billing.fullName}</p>
                              <p className="text-sm text-gray-600"><strong>Adresse:</strong> {billing.address}</p>
                              <p className="text-sm text-gray-600"><strong>Ville:</strong> {billing.city}</p>
                              <p className="text-sm text-gray-600"><strong>Code Postal:</strong> {billing.postalCode}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )})}
                </tbody>
              </table>
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

              {/* Cloud Storage Settings */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Globe className="w-5 h-5 text-blue-600 mr-3" />
                  {t("admin.settings.cloudStorage") || "Cloud Storage"}
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("admin.settings.activeProvider") || "Active Storage Provider"}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {["supabase", "s3", "bunny", "gcs", "backblaze", "local"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSettingsData({ ...settingsData, storage_provider: p as any })}
                          className={`p-4 border rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                            settingsData.storage_provider === p
                              ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                              : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <span className="uppercase text-xs">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {settingsData.storage_provider === "backblaze" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div className="col-span-full font-bold text-sm text-gray-800">Backblaze B2 (S3 Compatible)</div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-500">Key ID</label>
                          {settingsData._envStatus?.b2_access && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider scale-75 origin-right">In ENV</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={settingsData.b2_key_id || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, b2_key_id: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="004...XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Application Key</label>
                        <input
                          type="password"
                          value={settingsData.b2_application_key || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, b2_application_key: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="K004...XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Bucket Name</label>
                        <input
                          type="text"
                          value={settingsData.b2_bucket || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, b2_bucket: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="my-bucket"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">S3 Endpoint</label>
                        <input
                          type="text"
                          value={settingsData.b2_endpoint || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, b2_endpoint: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="s3.us-west-004.backblazeb2.com"
                        />
                      </div>
                      <div className="col-span-full text-[10px] text-gray-400">
                        <p>Note: Backblaze B2 files are served via the S3 endpoint. Ensure your bucket is public or use a CDN if needed.</p>
                      </div>
                    </div>
                  )}

                  {settingsData.storage_provider === "local" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div className="col-span-full font-bold text-sm text-gray-800">Local Disk Storage</div>
                      <div className="col-span-full">
                         <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
                           <strong>Warning:</strong> If you are deploying to an ephemeral serverless environment (like Vercel, Netlify, Cloud Run), local disk storage will <strong>NOT</strong> persist. Uploaded files will disappear when the container restarts. Only use this for testing, VPS hosting (DigitalOcean, AWS EC2), or AI Studio development.
                         </div>
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Local Server Base URL (Optional - defaults to auto)</label>
                        <input
                          type="text"
                          placeholder="e.g. https://yourdomain.com"
                          value={settingsData.local_storage_url || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, local_storage_url: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {settingsData.storage_provider === "s3" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div className="col-span-full font-bold text-sm text-gray-800">AWS S3 / Cloudflare R2 / S3 Compatible</div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-500">Access Key</label>
                          {settingsData._envStatus?.s3_access && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider scale-75 origin-right">In ENV</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={settingsData.s3_access_key || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, s3_access_key: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={settingsData.s3_secret_key || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, s3_secret_key: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Region</label>
                        <input
                          type="text"
                          placeholder="us-east-1"
                          value={settingsData.s3_region || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, s3_region: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Bucket Name</label>
                        <input
                          type="text"
                          value={settingsData.s3_bucket || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, s3_bucket: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Endpoint URL (Optional for R2/Other)</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={settingsData.s3_endpoint || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, s3_endpoint: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Custom Public URL (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://cdn.example.com"
                          value={settingsData.s3_custom_url || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, s3_custom_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {settingsData.storage_provider === "bunny" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div className="col-span-full font-bold text-sm text-gray-800">BunnyCDN Settings</div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Storage Zone Name</label>
                        <input
                          type="text"
                          value={settingsData.bunny_storage_zone || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, bunny_storage_zone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-500">Storage API Key</label>
                          {settingsData._envStatus?.bunny_key && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider scale-75 origin-right">In ENV</span>
                          )}
                        </div>
                        <input
                          type="password"
                          value={settingsData.bunny_api_key || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, bunny_api_key: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Pull Zone URL (e.g. https://myzone.b-cdn.net)</label>
                        <input
                          type="url"
                          value={settingsData.bunny_pull_zone_url || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, bunny_pull_zone_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {settingsData.storage_provider === "gcs" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div className="col-span-full font-bold text-sm text-gray-800">Google Cloud Storage</div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-gray-500">Project ID</label>
                          {settingsData._envStatus?.gcs_project && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider scale-75 origin-right">In ENV</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={settingsData.gcs_project_id || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, gcs_project_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Bucket Name</label>
                        <input
                          type="text"
                          value={settingsData.gcs_bucket || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, gcs_bucket: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-xs font-medium text-gray-500 mb-1">JSON Key Credentials</label>
                        <textarea
                          value={settingsData.gcs_credentials || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, gcs_credentials: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-32 font-mono"
                          placeholder='{"type": "service_account", ...}'
                        />
                      </div>
                    </div>
                  )}

                  {(!settingsData.storage_provider || settingsData.storage_provider === "supabase") && (
                    <div className="pt-4 border-t border-gray-50 space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3 shadow-sm">
                        <CheckCircle className="text-blue-600 mt-1" size={18} />
                        <div className="text-xs text-blue-700 leading-relaxed">
                          Supabase storage is configured. You can enter credentials below to override environment variables. Use the bucket named <code className="bg-blue-100 px-1 rounded font-bold">media</code>.
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Supabase URL</label>
                            {settingsData._envStatus?.supabase_url && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded uppercase tracking-wider scale-75 origin-right">
                                <Globe size={10} /> In ENV
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="https://your-project.supabase.co"
                            value={settingsData.supabase_url || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, supabase_url: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Supabase Anon Key</label>
                            {settingsData._envStatus?.supabase_anon_key && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded uppercase tracking-wider scale-75 origin-right">
                                <Shield size={10} /> In ENV
                              </span>
                            )}
                          </div>
                          <input
                            type="password"
                            placeholder="your-anon-key"
                            value={settingsData.supabase_anon_key || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, supabase_anon_key: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* API & Backend Configurations */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Key className="w-5 h-5 text-blue-600 mr-3" />
                  API & Backend Configurations
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start space-x-3 mb-4">
                    <Shield className="text-amber-600 mt-1" size={18} />
                    <div className="text-xs text-amber-700 leading-relaxed">
                      <strong>Environment Managed:</strong> Your core backend (Supabase & JWT) is managed via environment variables. Use the field below for AI feature configurations.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Gemini AI API Key</label>
                        {settingsData._envStatus?.gemini_api_key && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">Active in ENV</span>
                        )}
                      </div>
                      <input
                        type="password"
                        placeholder="AI API Key"
                        value={settingsData.gemini_api_key || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, gemini_api_key: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SMTP configuration */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                  {t('admin.settings.smtpConfig')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.smtpHost')}</label>
                    <input
                      type="text"
                      value={settingsData.smtp_host || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_host: e.target.value })}
                      placeholder="smtp.example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.smtpPort')}</label>
                    <input
                      type="number"
                      value={settingsData.smtp_port || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_port: Number(e.target.value) })}
                      placeholder="587"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.smtpUser')}</label>
                    <input
                      type="text"
                      value={settingsData.smtp_user || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_user: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.smtpPass')}</label>
                    <input
                      type="password"
                      value={settingsData.smtp_pass || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_pass: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.smtpFrom')}</label>
                    <input
                      type="email"
                      value={settingsData.smtp_from || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_from: e.target.value })}
                      placeholder="noreply@example.com"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.settings.smtpAdmin')}</label>
                    <input
                      type="email"
                      value={settingsData.smtp_admin || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_admin: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-4">
                    <input
                      type="checkbox"
                      checked={settingsData.smtp_secure || false}
                      onChange={(e) => setSettingsData({ ...settingsData, smtp_secure: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Utiliser SSL/TLS (Port 465)</label>
                  </div>
                </div>
              </div>

              {/* Payment Gateway: Chargily */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Chargily Pay V2</h3>
                    <p className="text-sm text-gray-500">Manage your payment gateway mode and keys</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Operating Mode</label>
                  <select
                    value={settingsData.chargily_mode || 'test'}
                    onChange={(e) => setSettingsData({ ...settingsData, chargily_mode: e.target.value as 'test' | 'live' })}
                    className="w-full md:w-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="test">Test Mode</option>
                    <option value="live">Live Mode</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Test Keys */}
                  <div className="space-y-4 p-5 bg-gray-50/50 border border-gray-100 rounded-xl">
                    <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                      Test Mode Keys
                    </h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Test Public Key</label>
                      <input
                        type="text"
                        value={settingsData.chargily_test_public_key || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, chargily_test_public_key: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="test_pk_..."
                      />
                      {settingsData._envStatus?.chargily_test_public_key && !settingsData.chargily_test_public_key && (
                        <p className="text-xs text-green-600 mt-1 font-medium">Using key from ENV file</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Test Secret Key</label>
                      <input
                        type="password"
                        value={settingsData.chargily_test_secret_key || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, chargily_test_secret_key: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="test_sk_..."
                      />
                      {settingsData._envStatus?.chargily_test_secret_key && !settingsData.chargily_test_secret_key && (
                        <p className="text-xs text-green-600 mt-1 font-medium">Using key from ENV file</p>
                      )}
                    </div>
                  </div>

                  {/* Live Keys */}
                  <div className="space-y-4 p-5 bg-gray-50/50 border border-gray-100 rounded-xl">
                    <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Live Mode Keys
                    </h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Live Public Key</label>
                      <input
                        type="text"
                        value={settingsData.chargily_live_public_key || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, chargily_live_public_key: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="live_pk_..."
                      />
                      {settingsData._envStatus?.chargily_live_public_key && !settingsData.chargily_live_public_key && (
                        <p className="text-xs text-green-600 mt-1 font-medium">Using key from ENV file</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Live Secret Key</label>
                      <input
                        type="password"
                        value={settingsData.chargily_live_secret_key || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, chargily_live_secret_key: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="live_sk_..."
                      />
                      {settingsData._envStatus?.chargily_live_secret_key && !settingsData.chargily_live_secret_key && (
                        <p className="text-xs text-green-600 mt-1 font-medium">Using key from ENV file</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center px-6 py-2 bg-[#1E3A8A] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Payment Settings
                  </button>
                </div>
              </div>

              {/* Website Contact & Footer Details */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Globe className="w-5 h-5 text-blue-600 mr-3" />
                  Contact, Legal & Footer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settingsData.contact_email || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="text"
                      value={settingsData.contact_phone || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Footer Copyright Name</label>
                    <input
                      type="text"
                      value={settingsData.footer_copyright || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, footer_copyright: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
                    <textarea
                      value={settingsData.contact_address || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, contact_address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Footer Description</label>
                    <textarea
                      value={settingsData.footer_desc || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, footer_desc: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions URL (Optional, overrides content below)</label>
                    <input
                      type="text"
                      value={settingsData.terms_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, terms_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions (HTML/Text)</label>
                    <textarea
                      rows={10}
                      value={settingsData.terms_html || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, terms_html: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                      placeholder="<h1>Terms & Conditions</h1><p>Welcome to our website...</p>"
                    />
                  </div>
                  <div className="col-span-full mt-4 border-t border-gray-100 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy URL (Optional, overrides content below)</label>
                    <input
                      type="text"
                      value={settingsData.privacy_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, privacy_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy (HTML/Text)</label>
                    <textarea
                      rows={10}
                      value={settingsData.privacy_html || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, privacy_html: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                      placeholder="<h1>Privacy Policy</h1><p>We respect your privacy...</p>"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center px-6 py-2 bg-[#1E3A8A] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Contact & Legal Details
                  </button>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                  </motion.div>
                  Social Media Configurations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/your-page"
                      value={settingsData.facebook_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, facebook_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/your-profile"
                      value={settingsData.instagram_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, instagram_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TikTok URL</label>
                    <input
                      type="url"
                      placeholder="https://tiktok.com/@your-handle"
                      value={settingsData.tiktok_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, tiktok_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter / X URL</label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/your-handle"
                      value={settingsData.twitter_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, twitter_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                      value={settingsData.linkedin_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, linkedin_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@your-channel"
                      value={settingsData.youtube_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, youtube_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center px-6 py-2 bg-[#1E3A8A] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Social Media Links
                  </button>
                </div>
              </div>

              {/* Floating Chat Popup Settings */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-6">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                  Floating Chat Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 md:col-span-2 mb-2">
                    <input
                      type="checkbox"
                      checked={settingsData.floating_chat_enabled || false}
                      onChange={(e) => setSettingsData({ ...settingsData, floating_chat_enabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">Enable Floating Chat Button</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Icon</label>
                    <select
                      value={settingsData.floating_chat_icon || "whatsapp"}
                      onChange={(e) => setSettingsData({ ...settingsData, floating_chat_icon: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="messenger">Messenger</option>
                      <option value="telegram">Telegram</option>
                      <option value="custom">Custom (Generic Chat Icon)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chat Link / URL</label>
                    <input
                      type="url"
                      placeholder="e.g. https://wa.me/213500000000"
                      value={settingsData.floating_chat_url || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, floating_chat_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  {settingsData.floating_chat_icon === 'custom' && (
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Chat Icon Image</label>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors">
                          {settingsData.floating_chat_custom_icon ? (
                            <img
                              src={settingsData.floating_chat_custom_icon}
                              alt="Custom Chat Icon"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="text-gray-300 w-6 h-6" />
                          )}
                          <input
                            type="file"
                            onChange={(e) => handleLogoUpload(e, "floating_chat_custom_icon")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Format: SVG, PNG, JPG</p>
                          <p>Upload a square image for best results.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center px-6 py-2 bg-[#1E3A8A] text-white rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Chat Settings
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-8">
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

          {activeTab === "announcements" && (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">Notifications & Live Classes</h2>
                  <p className="text-sm text-gray-500 mt-1">Send meeting links and updates to course or event participants.</p>
                </div>
                <button
                  onClick={() => setIsAddingAnnouncement(true)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                >
                  <Plus size={18} />
                  <span>Send Notification</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Target</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="p-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {announcements.map((ann) => (
                        <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-gray-800">{ann.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-1">{ann.message}</p>
                          </td>
                          <td className="p-4">
                            {ann.courseTitle ? (
                              <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">Course: {ann.courseTitle}</span>
                            ) : ann.eventTitle ? (
                              <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 uppercase tracking-wider">Event: {ann.eventTitle}</span>
                            ) : (
                              <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-gray-100 text-gray-700 uppercase tracking-wider">All</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {new Date(ann.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteAnnouncement(ann.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {announcements.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">
                            No notifications sent yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "email_templates" && (
            <motion.div
              key="email_templates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">Email Templates</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage email templates (order confirmations, password resets).</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-8">
                {emailTemplates.map((template) => (
                  <form key={template.key} className="border border-gray-100 rounded-xl p-6 shadow-sm" onSubmit={async (e) => {
                    e.preventDefault();
                    // update logic
                    const subject = (e.currentTarget.elements.namedItem('subject') as HTMLInputElement).value;
                    const body_html = (e.currentTarget.elements.namedItem('body_html') as HTMLTextAreaElement).value;
                    try {
                      await fetch(`/api/admin/email-templates/${template.key}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ subject, body_html })
                      });
                      alert('Template saved!');
                    } catch (e) {
                      console.error(e);
                      alert('Error saving template');
                    }
                  }}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest text-[#1E3A8A]">{template.key}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                        <input name="subject" defaultValue={template.subject} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-gray-700" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">HTML Body</label>
                        <textarea name="body_html" rows={6} defaultValue={template.body_html} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm text-gray-700 font-mono resize-y" />
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold tracking-wide hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                          Save Template
                        </button>
                      </div>
                    </div>
                  </form>
                ))}
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

        <AnimatePresence>
          {isAddingAnnouncement && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-black text-gray-800 tracking-tight">Send Notification</h3>
                  <button
                    onClick={() => setIsAddingAnnouncement(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Course (Optional)</label>
                    <select
                      value={newAnnouncement.courseId}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, courseId: e.target.value, eventId: "" })}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-gray-700"
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id.toString()}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Event (Optional)</label>
                    <select
                      value={newAnnouncement.eventId}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, eventId: e.target.value, courseId: "" })}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-gray-700"
                    >
                      <option value="">-- Select Event --</option>
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id.toString()}>{ev.title_en || ev.title_fr}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-gray-700"
                      placeholder="e.g. Live Class Today at 8PM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message Content / Links</label>
                    <textarea
                      required
                      rows={5}
                      value={newAnnouncement.message}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm text-gray-700 resize-none"
                      placeholder="Include meeting link, password, instructions etc."
                    />
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold tracking-wide hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Texte du bouton (Slide)
                      </label>
                      <input
                        type="text"
                        value={newSlide.buttonText}
                        onChange={(e) =>
                          setNewSlide({ ...newSlide, buttonText: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        placeholder="ex: En savoir plus"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Lien du bouton (Slide)
                      </label>
                      <input
                        type="text"
                        value={newSlide.buttonLink}
                        onChange={(e) =>
                          setNewSlide({ ...newSlide, buttonLink: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        placeholder="ex: /formations"
                      />
                    </div>
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
    </AdminLayout>
  );
}
