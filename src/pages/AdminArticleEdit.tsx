import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import AdminLayout from "../components/AdminLayout";
import {
  ArrowLeft,
  Save,
  Globe,
  FileText,
  Upload,
  User as UserIcon,
  Tag
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Article } from "../types";
import toast from "react-hot-toast";

const AdminArticleEdit = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articleData, setArticleData] = useState<Partial<Article>>({
    title_en: "",
    title_fr: "",
    excerpt_en: "",
    excerpt_fr: "",
    content_en: "",
    content_fr: "",
    image: "",
    author: "",
    category: "",
    status: "published",
  });

  useEffect(() => {
    if (id && id !== "new") {
      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArticleData(data);
      } else {
        toast.error(t('blog.notFound'));
        navigate("/admin?tab=articles");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error(t('admin.course.loadError'));
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
          setArticleData({...articleData, image: data.url});
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
      ? `/api/admin/articles/${id}`
      : "/api/admin/articles";
    const method = id && id !== "new" ? "PUT" : "POST";

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
        toast.success(id && id !== "new" ? t('admin.articles.successUpdate') : t('admin.articles.successCreate'));
        navigate("/admin?tab=articles");
      } else {
        const err = await res.json();
        toast.error(err.error || t('admin.articles.errorSave'));
      }
    } catch (error) {
      console.error("Error saving article:", error);
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
                onClick={() => navigate("/admin?tab=articles")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {id && id !== "new" ? t('admin.articles.editArticle') : t('admin.articles.newArticle')}
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/admin?tab=articles")}
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
                    value={articleData.title_fr || ""}
                    onChange={e => setArticleData({...articleData, title_fr: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.excerpt')} (FR)</label>
                  <textarea 
                    required
                    rows={3}
                    value={articleData.excerpt_fr || ""}
                    onChange={e => setArticleData({...articleData, excerpt_fr: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.content')} (FR) - Markdown</label>
                  <textarea 
                    required
                    rows={12}
                    value={articleData.content_fr || ""}
                    onChange={e => setArticleData({...articleData, content_fr: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-sm leading-relaxed"
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
                    value={articleData.title_en || ""}
                    onChange={e => setArticleData({...articleData, title_en: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.excerpt')} (EN)</label>
                  <textarea 
                    rows={3}
                    value={articleData.excerpt_en || ""}
                    onChange={e => setArticleData({...articleData, excerpt_en: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.content')} (EN) - Markdown</label>
                  <textarea 
                    rows={12}
                    value={articleData.content_en || ""}
                    onChange={e => setArticleData({...articleData, content_en: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileText size={18} className="text-[#1E3A8A]" />
                {t('admin.articles.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.author')}</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={articleData.author || ""}
                      onChange={e => setArticleData({...articleData, author: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.category')}</label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={articleData.category || ""}
                      onChange={e => setArticleData({...articleData, category: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.common.imageUrl')}</label>
                  <div className="flex gap-4">
                    <div className="flex-grow relative">
                      <input 
                        type="url" 
                        required
                        value={articleData.image || ""}
                        onChange={e => setArticleData({...articleData, image: e.target.value})}
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
                  {articleData.image && (
                    <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-100 aspect-video max-w-md">
                      <img src={articleData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                   <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2">{t('admin.articles.status')}</label>
                   <select
                     value={articleData.isPublished ? 'published' : 'draft'}
                     onChange={e => setArticleData({...articleData, isPublished: e.target.value === 'published'})}
                     className="w-full px-4 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold appearance-none bg-white"
                   >
                     <option value="draft">{t('admin.articles.draft')}</option>
                     <option value="published">{t('admin.articles.published')}</option>
                   </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminArticleEdit;
