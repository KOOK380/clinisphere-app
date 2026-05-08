import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Password reset successfully! Redirecting...' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to reset password' });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Network error.' });
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
          <div className="bg-[#3B2A8F] rounded-[2.5rem] px-6 md:px-12 py-10 md:py-20 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
             <span className="text-blue-300 font-black tracking-[0.3em] uppercase text-[10px] mb-6 block relative z-10">RECOVERY</span>
             <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter relative z-10">Reset Password</h2>
             <p className="text-blue-100/60 font-medium relative z-10">Choose a new password for your account</p>
          </div>

          {!token ? (
            <div className="px-12 py-16 text-center text-red-500 font-black">
              Invalid or missing reset token.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 md:px-12 py-10 md:py-16 space-y-10">
              {status.message && (
                <div className={`p-6 rounded-2xl text-sm flex items-center space-x-4 border font-black ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B2A8F]/5 focus:bg-white transition-all text-[#3B2A8F] font-black placeholder:text-gray-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                    placeholder="NEW PASSWORD"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3B2A8F] text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-4 hover:bg-[#2d1f70] transition-all shadow-2xl shadow-[#3B2A8F]/20 active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                <Shield className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
