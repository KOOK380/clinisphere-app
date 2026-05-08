import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Article } from '../types';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#3b2a8f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-black mb-8">{t('blog.notFound')}</h1>
        <Link to="/articles" className="bg-[#3b2a8f] text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest">
          {t('blog.backToList')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fafaf9] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={article.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200' || undefined}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="bg-[#3b2a8f] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl mb-8 inline-block">
                {article.category || 'Médecine'}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter max-w-5xl leading-tight mb-8">
                {i18n.language === 'fr' 
                  ? (article.title_fr || article.title_en || article.title) 
                  : (article.title_en || article.title_fr || article.title)}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 text-gray-300 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-[#3b2a8f]" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-[#3b2a8f]" />
                  {article.author || 'Clinisphere'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <Link to="/articles" className="inline-flex items-center text-[#3b2a8f] font-black uppercase text-[10px] tracking-widest mb-12 group">
              <div className="w-10 h-10 bg-[#3b2a8f]/5 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#3b2a8f] group-hover:text-white transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              {t('blog.backToList')}
            </Link>

            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-gray-100 prose prose-lg prose-indigo max-w-none">
              <div className="markdown-body">
                <ReactMarkdown>
                  {i18n.language === 'fr' 
                    ? (article.content_fr || article.content_en || article.content) 
                    : (article.content_en || article.content_fr || article.content)}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#3b2a8f]/5 rounded-full flex items-center justify-center mb-8">
                <Share2 className="w-8 h-8 text-[#3b2a8f]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{t('blog.shareArticle')}</h3>
              <p className="text-gray-500 mb-10 font-medium">{t('blog.shareDesc')}</p>
              
              <div className="flex space-x-6">
                <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-all text-[#3b2a8f] shadow-sm">
                  <Facebook className="w-6 h-6" />
                </button>
                <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-all text-[#3b2a8f] shadow-sm">
                  <Twitter className="w-6 h-6" />
                </button>
                <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-all text-[#3b2a8f] shadow-sm">
                  <Linkedin className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="mt-12 bg-[#3b2a8f] rounded-[3rem] p-12 shadow-xl text-white relative overflow-hidden">
               <div className="relative z-10">
                <h3 className="text-3xl font-black mb-6 tracking-tighter">{t('blog.readyToLearn')}</h3>
                <p className="text-[#9d92e0] font-medium mb-10 text-lg leading-relaxed">
                  {t('blog.readyDesc')}
                </p>
                <Link 
                  to="/courses"
                  className="bg-white text-[#3b2a8f] w-full py-6 rounded-2xl flex items-center justify-center font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all shadow-xl"
                >
                  {t('blog.seeCourses')}
                </Link>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
