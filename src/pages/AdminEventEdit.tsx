import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import AdminLayout from "../components/AdminLayout";
import {
  ArrowLeft,
  Save,
  Globe,
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
  Upload,
  Eye,
  CheckCircle,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Event } from "../types";
import toast from "react-hot-toast";
import { useSettings } from "../contexts/SettingsContext";

const AdminEventEdit = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventData, setEventData] = useState<Partial<Event>>({
    title_en: "",
    title_fr: "",
    description_en: "",
    description_fr: "",
    eventDate: "",
    location: "",
    type: "free",
    price: 0,
    banner: "",
    status: "published",
  });

  useEffect(() => {
    if (id && id !== "new") {
      fetchEvent();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
      } else {
        toast.error(t('events.noEventsFound'));
        navigate("/admin?tab=events");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error(t('admin.articles.errorConn'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          setEventData({...eventData, banner: data.url});
          toast.success(t('admin.common.uploadSuccess'));
        } else {
          toast.error(data.error || t('admin.common.uploadError'));
        }
      } catch (error) {
        toast.error(t('admin.common.networkError'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const url = id && id !== "new"
      ? `/api/admin/events/${id}`
      : "/api/admin/events";
    const method = id && id !== "new" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (res.ok) {
        toast.success(id && id !== "new" ? t('admin.events.successUpdate') : t('admin.events.successCreate'));
        navigate("/admin?tab=events");
      } else {
        toast.error(t('admin.events.errorSave'));
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(t('admin.articles.errorConn'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin?tab=events")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {id && id !== "new" ? t('admin.events.editEvent') : t('admin.events.newEvent')}
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin?tab=events")}
                className="px-6 py-2 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#1E3A8A] text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? t('admin.common.saving') : t('admin.common.save')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* French Content */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-blue-600" />
                  <span className="text-sm font-black uppercase text-blue-600 tracking-widest">{t('admin.common.frContent')}</span>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.title')} (FR)</label>
                  <input 
                    type="text" 
                    required
                    value={eventData.title_fr || ""}
                    onChange={e => setEventData({...eventData, title_fr: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.description')} (FR)</label>
                  <textarea 
                    required
                    rows={8}
                    value={eventData.description_fr || ""}
                    onChange={e => setEventData({...eventData, description_fr: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm leading-relaxed"
                  />
                </div>
              </div>

              {/* English Content */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-blue-600" />
                  <span className="text-sm font-black uppercase text-blue-600 tracking-widest">{t('admin.common.enContent')}</span>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 font-black">{t('admin.common.title')} (EN)</label>
                  <input 
                    type="text" 
                    value={eventData.title_en || ""}
                    onChange={e => setEventData({...eventData, title_en: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.description')} (EN)</label>
                  <textarea 
                    rows={8}
                    value={eventData.description_en || ""}
                    onChange={e => setEventData({...eventData, description_en: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <SettingsIcon size={18} className="text-[#1E3A8A]" />
                {t('admin.events.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.events.date')}</label>
                  <div className="relative">
                    <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="datetime-local" 
                      required
                      value={eventData.eventDate ? eventData.eventDate.replace('Z', '') : ''}
                      onChange={e => setEventData({...eventData, eventDate: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.events.location')}</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={eventData.location || ""}
                      onChange={e => setEventData({...eventData, location: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.events.type')}</label>
                  <select
                    value={eventData.type || "free"}
                    onChange={e => setEventData({...eventData, type: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold appearance-none bg-white"
                  >
                    <option value="free">{t('admin.events.free')}</option>
                    <option value="paid">{t('admin.events.paid')}</option>
                  </select>
                </div>

                {eventData.type === 'paid' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.price')} ({settings?.currencySymbol})</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        required
                        value={eventData.price || 0}
                        onChange={e => setEventData({...eventData, price: Number(e.target.value)})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="col-span-full">
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.events.banner')}</label>
                  <div className="flex gap-4">
                    <div className="flex-grow relative">
                      <input 
                        type="url" 
                        required
                        value={eventData.banner || ""}
                        onChange={e => setEventData({...eventData, banner: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="relative">
                      <button type="button" className="bg-[#1E3A8A] text-white p-3 rounded-xl hover:bg-blue-800 transition-colors h-full px-6 flex items-center gap-2 font-bold text-xs">
                        <Upload size={18} />
                        {t('admin.common.upload')}
                      </button>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                  {eventData.banner && (
                    <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-100 aspect-video max-w-md">
                      <img src={eventData.banner || undefined} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.events.status')}</label>
                  <div className="flex items-center gap-4">
                    <select
                      value={eventData.status || "draft"}
                      onChange={e => setEventData({...eventData, status: e.target.value as any})}
                      className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold appearance-none bg-white"
                    >
                      <option value="draft">{t('admin.articles.draft')}</option>
                      <option value="published">{t('admin.articles.published')}</option>
                    </select>
                    {eventData.status === 'published' ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <X className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

const SettingsIcon = (props: any) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default AdminEventEdit;
