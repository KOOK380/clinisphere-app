import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Tiktok } from '../components/CustomIcons';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Contact() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
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
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Phone, label: t('contact.labels.phone'), value: settings.contact_phone || '+213 (0) 555 00 00 00' },
    { icon: Mail, label: t('contact.labels.email'), value: settings.contact_email || 'contact@focmeds.agency' },
    { icon: MapPin, label: t('contact.labels.address'), value: settings.contact_address || 'Alger, Algérie' }
  ];

  return (
    <div className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <span className="text-[#3b2a8f] font-bold tracking-widest uppercase text-xs block mb-4">{t('contact.badge')}</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
              {t('contact.title')} <span className="text-[#3b2a8f]">{t('contact.titleAccent')}</span> {t('contact.titleSuffix')}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
              {t('contact.desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {contactItems.map((item, i) => (
                <div key={i} className="flex flex-col items-start p-6 rounded-[1.5rem] bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-50 hover:shadow-md hover:border-gray-100 transition-all group">
                  <div className="w-12 h-12 bg-[#3b2a8f]/5 rounded-xl flex items-center justify-center group-hover:bg-[#3b2a8f] transition-colors mb-5 shrink-0">
                    <item.icon className="w-5 h-5 text-[#3b2a8f] group-hover:text-white transition-colors" />
                  </div>
                  <div className="w-full">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 break-words">{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Social Media Card */}
              <div className="flex flex-col items-start p-6 rounded-[1.5rem] bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-50 hover:shadow-md hover:border-gray-100 transition-all group">
                <div className="w-12 h-12 bg-[#3b2a8f]/5 rounded-xl flex items-center justify-center group-hover:bg-[#3b2a8f] transition-colors mb-5 shrink-0">
                  <Globe className="w-5 h-5 text-[#3b2a8f] group-hover:text-white transition-colors" />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">FOLLOW US</p>
                  <div className="flex flex-wrap gap-2.5">
                    {settings.facebook_url && (
                      <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-colors text-gray-400">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {settings.instagram_url && (
                       <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-colors text-gray-400">
                         <Instagram className="w-4 h-4" />
                       </a>
                    )}
                    {settings.twitter_url && (
                        <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-colors text-gray-400">
                          <Twitter className="w-4 h-4" />
                        </a>
                    )}
                    {settings.linkedin_url && (
                        <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-colors text-gray-400">
                          <Linkedin className="w-4 h-4" />
                        </a>
                    )}
                    {settings.youtube_url && (
                        <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-[#3b2a8f] hover:text-white transition-colors text-gray-400">
                          <Youtube className="w-4 h-4" />
                        </a>
                    )}
                    {settings.tiktok_url && (
                        <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-[#3b2a8f] transition-colors text-gray-400 hover:text-white">
                          <Tiktok className="w-4 h-4" />
                        </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">{t('contact.form.success')}</h2>
                <p className="text-gray-500 mb-8 font-medium">{t('contact.form.successDesc')}</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-[#3b2a8f] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-all"
                >
                  {t('contact.form.another')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">{t('contact.form.name')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-bold text-sm placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">{t('contact.form.email')}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-bold text-sm placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">PHONE NUMBER</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-bold text-sm placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      placeholder="YOUR PHONE NUMBER"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">SUBJECT</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-bold text-sm placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                      placeholder="WHAT IS THIS ABOUT?"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">{t('contact.form.message')}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#3b2a8f]/5 transition-all outline-none text-[#3B2A8F] font-bold text-sm placeholder:text-gray-300 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3b2a8f] text-white py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-[#2d1f70] transition-all shadow-[0_8px_20px_-4px_rgba(59,42,143,0.3)] active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
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
