import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Languages } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

interface NavbarProps {
  cartCount: number;
  user: any | null;
  onLogout: () => void;
}

export default function Navbar({ cartCount, user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            {settings.headerLogo ? (
              <a href={settings.logoLink} className="block h-10">
                <img src={settings.headerLogo} alt="Logo" className="h-full w-auto object-contain" />
              </a>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3B2A8F] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B2A8F]/20">
                  <div className="w-5 h-5 border-2 border-white rounded-full"></div>
                </div>
                <Link to="/" className="text-2xl font-black text-[#3B2A8F] tracking-tighter">
                  CLINISPHERE
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold text-[#3B2A8F]/60 uppercase tracking-[0.2em]">
            <Link to="/" className="text-[#3B2A8F] border-b-2 border-[#3B2A8F] pb-1 transition-all">{t('navbar.home')}</Link>
            <Link to="/formations" className="hover:text-[#3B2A8F] transition-colors">{t('navbar.formations')}</Link>
            <Link to="/boutique" className="hover:text-[#3B2A8F] transition-colors">{t('navbar.boutique')}</Link>
            <Link to="/services" className="hover:text-[#3B2A8F] transition-colors">{t('navbar.services')}</Link>
            <Link to="/contact" className="hover:text-[#3B2A8F] transition-colors">{t('navbar.contact')}</Link>
            <Link to="/instructors" className="hover:text-[#3B2A8F] transition-colors">{t('navbar.instructors')}</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 transition-colors uppercase font-medium">{t('navbar.admin')}</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 p-2 text-[#3B2A8F]/60 hover:text-[#3B2A8F] transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <Languages className="w-4 h-4" />
              <span>{i18n.language === 'fr' ? 'EN' : 'FR'}</span>
            </button>

            <Link to="/cart" className="relative p-2 text-[#3B2A8F] hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-black text-[#3B2A8F]">{user.name}</span>
                <button onClick={onLogout} title={t('navbar.logout')} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-6 py-2.5 rounded-full border border-[#3B2A8F] text-[#3B2A8F] font-black text-xs uppercase tracking-widest hover:bg-[#3B2A8F] hover:text-white transition-all">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="px-6 py-2.5 rounded-full bg-[#3B2A8F] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#3B2A8F]/20 hover:scale-105 active:scale-95 transition-all">
                  {t('navbar.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                 {cartCount}
               </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 p-2 bg-[#3B2A8F]/5 rounded-xl text-[#3B2A8F] font-black text-xs uppercase tracking-widest"
                >
                  <Languages className="w-4 h-4" />
                  <span>{i18n.language === 'fr' ? 'EN' : 'FR'}</span>
                </button>
              </div>
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-black text-[#3B2A8F] tracking-tight">{t('navbar.home')}</Link>
              <Link to="/formations" onClick={() => setIsOpen(false)} className="block text-lg font-black text-[#3B2A8F] tracking-tight">{t('navbar.formations')}</Link>
              <Link to="/boutique" onClick={() => setIsOpen(false)} className="block text-lg font-black text-[#3B2A8F] tracking-tight">{t('navbar.boutique')}</Link>
              <Link to="/services" onClick={() => setIsOpen(false)} className="block text-lg font-black text-[#3B2A8F] tracking-tight">{t('navbar.services')}</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-lg font-black text-[#3B2A8F] tracking-tight">{t('navbar.contact')}</Link>
              <Link to="/instructors" onClick={() => setIsOpen(false)} className="block text-lg font-black text-[#3B2A8F] tracking-tight">{t('navbar.instructors')}</Link>
              {user && user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-black text-red-600 tracking-tight uppercase">{t('navbar.admin')}</Link>
              )}
              {!user ? (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-[#3B2A8F] text-white text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest">{t('navbar.login')}</Link>
              ) : (
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left text-lg font-black text-red-600 uppercase tracking-widest">{t('navbar.logout')}</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
