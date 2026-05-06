import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Video,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Settings as SettingsIcon,
  ShoppingBag,
  Users,
  ArrowLeft,
  Globe,
  LogOut,
  MessageSquare,
  Mail
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      id: "dashboard",
      path: "/admin",
      label: t("admin.sidebar.dashboard"),
      icon: LayoutDashboard,
    },
    { id: "slider", path: "/admin?tab=slider", label: t("admin.slider.title"), icon: Video },
    { id: "courses", path: "/admin?tab=courses", label: t("admin.sidebar.courses"), icon: BookOpen },
    { id: "events", path: "/admin?tab=events", label: t("admin.sidebar.events"), icon: Calendar },
    { id: "articles", path: "/admin?tab=articles", label: t("admin.sidebar.articles"), icon: FileText },
    {
      id: "instructors",
      path: "/admin?tab=instructors",
      label: t("admin.sidebar.instructors"),
      icon: GraduationCap,
    },
    { id: "settings", path: "/admin?tab=settings", label: t("admin.sidebar.settings"), icon: SettingsIcon },
    { id: "orders", path: "/admin?tab=orders", label: t("admin.sidebar.orders"), icon: ShoppingBag },
    { id: "users", path: "/admin?tab=users", label: t("admin.sidebar.users"), icon: Users },
    { id: "announcements", path: "/admin?tab=announcements", label: "Notifications & Meets", icon: MessageSquare },
    { id: "email_templates", path: "/admin?tab=email_templates", label: "Email Templates", icon: Mail },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (item: any) => {
    if (item.id === 'dashboard' && location.pathname === '/admin' && !location.search) return true;
    if (location.search.includes(`tab=${item.id}`)) return true;
    // Courses tab should be active for course editing too
    if (item.id === 'courses' && location.pathname.startsWith('/admin/courses')) return true;
    if (item.id === 'events' && location.pathname.startsWith('/admin/events')) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1E3A8A]">
            {t("admin.panelTitle")}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t("admin.panelSubtitle")}
          </p>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <Link
            to="/"
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-all mb-4"
          >
            <ArrowLeft size={18} className="mr-3" />
            {t("admin.sidebar.backToSite")}
          </Link>

          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive(item)
                  ? "bg-blue-50 text-[#1E3A8A] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={18} className="mr-3" />
              {item.label}
            </Link>
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
      <div className="flex-grow pl-64 overflow-y-auto min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
