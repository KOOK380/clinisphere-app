import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Articles() {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#3b2a8f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#fafaf9] py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#3b2a8f] font-bold tracking-widest uppercase text-sm block mb-4"
          >
            {t('blog.badge')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter"
          >
            {t('blog.title')} <span className="text-[#3b2a8f]">{t('blog.titleAccent')}</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
            >
              <Link to={`/articles/${article.slug}`}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800' || undefined}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#3b2a8f] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {article.category || t('blog.category')}
                    </span>
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex items-center space-x-4 mb-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#3b2a8f]" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-[#3b2a8f]" />
                      {article.author || 'Clinisphere'}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#3b2a8f] transition-colors leading-tight">
                    {i18n.language === 'fr' 
                      ? (article.title_fr || article.title_en || article.title) 
                      : (article.title_en || article.title_fr || article.title)}
                  </h2>
                  <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed font-medium">
                    {i18n.language === 'fr' 
                      ? (article.excerpt_fr || article.excerpt_en || article.excerpt) 
                      : (article.excerpt_en || article.excerpt_fr || article.excerpt)}
                  </p>

                  <div className="flex items-center text-[#3b2a8f] font-black uppercase text-[10px] tracking-widest group-hover:translate-x-2 transition-transform">
                    <span>{t('blog.readMore')}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase tracking-widest">{t('blog.noArticles')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
