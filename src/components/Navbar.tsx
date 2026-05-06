import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Facebook, Instagram, Languages, Music, Youtube, Linkedin, Twitter, Mail, Phone } from 'lucide-react';
import { Tiktok } from './CustomIcons';
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
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => 
    `transition-colors pb-0.5 transition-all duration-300 ${isActive(path) 
      ? 'text-[#08678C] font-bold border-b-2 border-[#08678C]' 
      : 'hover:text-[#08678C]'}`;

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#3B2A8F] text-white py-2 hidden md:block border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center space-x-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Mail size={12} className="text-blue-300 group-hover:scale-110 transition-transform" />
              <span className="hover:text-blue-300 transition-colors">{settings.contact_email || "contact@focmeds.agency"}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <Phone size={12} className="text-blue-300 group-hover:scale-110 transition-transform" />
              <span className="hover:text-blue-300 transition-colors">{settings.contact_phone || "+213 (0) 555 00 00 00"}</span>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-all hover:scale-110">
                <Facebook size={14} />
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-all hover:scale-110">
                <Instagram size={14} />
              </a>
            )}
            {settings.twitter_url && (
              <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-all hover:scale-110">
                <Twitter size={14} />
              </a>
            )}
            {settings.tiktok_url && (
              <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-all hover:scale-110">
                <Tiktok size={14} />
              </a>
            )}
            {settings.linkedin_url && (
              <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-all hover:scale-110">
                <Linkedin size={14} />
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-all hover:scale-110">
                <Youtube size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <Link to={settings.logoLink || "/"} className="flex items-center">
              {settings.headerLogo ? (
                <img 
                  src={settings.headerLogo} 
                  alt="Logo" 
                  className="h-20 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-[#3B2A8F] tracking-tight">Foc.Med.s Agency</span>
              )}
            </Link>
          </div>

            <div className="hidden md:flex items-center space-x-6 text-[13px] font-medium text-gray-500">
              <Link to="/" className={navLinkClass('/')}>{t('navbar.home')}</Link>
              <Link to="/formations" className={navLinkClass('/formations')}>{t('navbar.formations')}</Link>
              <Link to="/events" className={navLinkClass('/events')}>{t('navbar.events')}</Link>
              <Link to="/articles" className={navLinkClass('/articles')}>{t('navbar.articles')}</Link>
              <Link to="/services" className={navLinkClass('/services')}>{t('navbar.services')}</Link>
              <Link to="/contact" className={navLinkClass('/contact')}>{t('navbar.contact')}</Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-[#3B2A8F] transition-all font-black text-[10px] tracking-widest border border-gray-100 rounded-xl px-4 py-2 hover:bg-gray-50 active:scale-95"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{i18n.language.startsWith('fr') ? 'EN' : 'FR'}</span>
              </button>

              <div className="h-8 w-px bg-gray-100 mx-2" />

              <div className="flex items-center space-x-6">
                <Link to="/cart" className="relative p-2 text-gray-800 hover:scale-110 transition-transform flex items-center group">
                  <ShoppingCart className="w-5 h-5 group-hover:text-[#3B2A8F] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#3B2A8F] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="flex items-center space-x-6">
                    <Link 
                      to={user.role === 'admin' ? "/admin" : "/dashboard"} 
                      className="text-[#3B2A8F] font-black uppercase text-[10px] tracking-widest px-4 py-2 bg-[#3B2A8F]/5 rounded-xl hover:bg-[#3B2A8F] hover:text-white transition-all active:scale-95"
                    >
                      {user.role === 'admin' ? t('navbar.admin') : t('navbar.dashboard')}
                    </Link>
                    <button onClick={onLogout} className="text-red-500 hover:text-red-600 transition-colors">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="bg-[#3B2A8F] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2d1f70] transition-all shadow-xl shadow-[#3B2A8F]/20 active:scale-95">
                    {t('navbar.login')}
                  </Link>
                )}
              </div>
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="md:hidden fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setIsOpen(false)}><X size={32} /></button>
            </div>
            <div className="flex flex-col space-y-6 text-2xl font-bold">
              <Link to="/" onClick={() => setIsOpen(false)}>{t('navbar.home')}</Link>
              <Link to="/formations" onClick={() => setIsOpen(false)}>{t('navbar.formations')}</Link>
              <Link to="/events" onClick={() => setIsOpen(false)}>{t('navbar.events')}</Link>
              <Link to="/articles" onClick={() => setIsOpen(false)}>{t('navbar.articles')}</Link>
              <Link to="/services" onClick={() => setIsOpen(false)}>{t('navbar.services')}</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}>{t('navbar.contact')}</Link>
            </div>
            
            <div className="flex items-center space-x-6 mt-12 py-6 border-t border-gray-100">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#08678C] transition-colors">
                  <Facebook size={24} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#08678C] transition-colors">
                  <Instagram size={24} />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#08678C] transition-colors">
                  <Twitter size={24} />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#08678C] transition-colors">
                  <Linkedin size={24} />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#08678C] transition-colors">
                  <Youtube size={24} />
                </a>
              )}
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#08678C] transition-colors flex items-center">
                  <Tiktok size={22} />
                </a>
              )}
            </div>

            <div className="mt-auto">
              {!user ? (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-black text-white text-center py-4 rounded-xl font-bold">{t('navbar.login')}</Link>
              ) : (
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full bg-black text-white text-center py-4 rounded-xl font-bold">{t('navbar.logout')}</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </header>
  );
}
