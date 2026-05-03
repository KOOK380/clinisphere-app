import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      onLogin(data.user, data.token);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-brand-bg py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-[3rem] shadow-3xl overflow-hidden border border-gray-100 p-2">
          <div className="bg-[#3B2A8F] rounded-[2.5rem] px-12 py-20 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
             <span className="text-blue-300 font-black tracking-[0.3em] uppercase text-[10px] mb-6 block relative z-10">{t('auth.login.badge')}</span>
             <h2 className="text-5xl font-black mb-4 tracking-tighter relative z-10">{t('auth.login.title')}</h2>
             <p className="text-blue-100/60 font-medium relative z-10">{t('auth.login.desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-12 py-16 space-y-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-sm flex items-center space-x-4 border border-red-100 font-black">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B2A8F]/5 focus:bg-white transition-all text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                  placeholder={t('auth.login.badge') === 'Espace Membre' ? 'Email Professionnel' : 'Professional Email'}
                />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B2A8F]/5 focus:bg-white transition-all text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                  placeholder={t('auth.login.badge') === 'Espace Membre' ? 'Mot de passe' : 'Password'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3B2A8F] text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-4 hover:bg-[#2d1f70] transition-all shadow-2xl shadow-[#3B2A8F]/20 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? t('auth.login.loading') : t('auth.login.button')}</span>
              <LogIn className="w-5 h-5" />
            </button>

            <div className="text-center pt-6">
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
                {t('auth.login.noAccount')}{' '}
                <Link to="/register" className="text-[#3B2A8F] hover:underline ml-2">
                  {t('auth.login.registerLink')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
