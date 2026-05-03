import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Phone, label: t('contact.labels.phone'), value: '+213 (0) 555 00 00 00' },
    { icon: Mail, label: t('contact.labels.email'), value: 'contact@clinisphere.dz' },
    { icon: MapPin, label: t('contact.labels.address'), value: '12 Rue des Médecins, Alger, Algérie' },
    { icon: Globe, label: t('contact.labels.social'), value: '@clinisphere_training' }
  ];

  return (
    <div className="py-24 bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-[#3b2a8f] font-bold tracking-widest uppercase text-sm block mb-4">{t('contact.badge')}</span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
              {t('contact.title')} <span className="text-[#3b2a8f]">{t('contact.titleAccent')}</span> {t('contact.titleSuffix')}
            </h1>
            <p className="text-gray-500 text-xl leading-relaxed mb-12 font-medium">
              {t('contact.desc')}
            </p>

            <div className="space-y-8">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-center space-x-6 p-6 rounded-3xl bg-white shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-[#3b2a8f]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#3b2a8f] transition-colors">
                    <item.icon className="w-6 h-6 text-[#3b2a8f] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-50">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.form.success')}</h2>
                <p className="text-gray-500 mb-8 font-medium">{t('contact.form.successDesc')}</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-[#3b2a8f] text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-all"
                >
                  {t('contact.form.another')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-transparent px-8 py-6 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">{t('contact.form.email')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-transparent px-8 py-6 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">{t('contact.form.message')}</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-transparent px-8 py-6 rounded-3xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none resize-none text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3b2a8f] text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-4 hover:bg-[#2d1f70] transition-all shadow-2xl shadow-[#3B2A8F]/20 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span>{loading ? t('contact.form.submitting') : t('contact.form.submit')}</span>
                 </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
