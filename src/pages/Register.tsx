import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, AlertCircle, User as UserIcon, Mail, Lock, Stethoscope, MapPin, Phone } from 'lucide-react';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

interface RegisterProps {
  onLogin: (user: User, token: string) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    city: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      onLogin(data.user, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-brand-bg py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-[3.5rem] shadow-3xl overflow-hidden border border-gray-100 p-2">
          <div className="bg-[#3B2A8F] rounded-[3rem] px-12 py-20 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
             <span className="text-blue-300 font-black tracking-[0.3em] uppercase text-[10px] mb-6 block relative z-10">{t('auth.register.badge')}</span>
             <h2 className="text-5xl font-black mb-4 tracking-tighter relative z-10">{t('auth.register.title')}</h2>
             <p className="text-blue-100/60 font-medium max-w-sm mx-auto relative z-10">
               {t('auth.register.desc')}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="px-16 py-20 space-y-12">
            {error && (
              <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-sm flex items-center space-x-4 border border-red-100 font-black">
                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Fields */}
              {[
                { name: 'name', label: t('auth.register.form.name'), placeholder: t('auth.register.form.namePlaceholder'), type: 'text' },
                { name: 'email', label: t('auth.register.form.email'), placeholder: t('auth.register.form.emailPlaceholder'), type: 'email' },
                { name: 'specialty', label: t('auth.register.form.specialty'), placeholder: t('auth.register.form.specialtyPlaceholder'), type: 'text' },
                { name: 'city', label: t('auth.register.form.city'), placeholder: t('auth.register.form.cityPlaceholder'), type: 'text' },
                { name: 'phone', label: t('auth.register.form.phone'), placeholder: t('auth.register.form.phonePlaceholder'), type: 'tel' },
                { name: 'password', label: t('auth.register.form.password'), placeholder: t('auth.register.form.passwordPlaceholder'), type: 'password' }
              ].map((field) => (
                <div key={field.name} className="space-y-4">
                  <label className="text-[10px] font-black text-[#3B2A8F]/40 uppercase tracking-[0.3em] pl-2">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    className="block w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B2A8F]/5 focus:bg-white transition-all text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3B2A8F] text-white py-8 rounded-[2rem] font-black uppercase tracking-widest text-[13px] flex items-center justify-center space-x-6 hover:bg-[#2d1f70] transition-all shadow-3xl shadow-[#3B2A8F]/20 active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? t('auth.register.loading') : t('auth.register.button')}</span>
                <UserPlus className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
                {t('auth.register.hasAccount')}{' '}
                <Link to="/login" className="text-[#3B2A8F] hover:underline ml-2">
                   {t('auth.register.loginLink')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
