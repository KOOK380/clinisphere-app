import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Music, Youtube, Linkedin, Twitter } from 'lucide-react';
import { Tiktok } from './CustomIcons';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <footer className="bg-[#08678C] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-4">
            <Link to={settings.logoLink || "/"} className="mb-6 block">
              {settings.footerLogo ? (
                <img 
                  src={settings.footerLogo} 
                  alt="Logo" 
                  className="h-20 w-auto object-contain" 
                />
              ) : (
                <span className="text-2xl font-bold tracking-tight">Foc.Med.s Agency</span>
              )}
            </Link>
            <p className="text-blue-50/70 text-sm leading-relaxed mb-8 max-w-sm italic">
              {settings.footer_desc || t('footer.desc')}
            </p>
            <div className="flex flex-wrap gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#08678C] transition-all" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#08678C] transition-all" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#08678C] transition-all" title="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#08678C] transition-all" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#08678C] transition-all" title="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#08678C] transition-all" title="TikTok">
                  <Tiktok className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8">{t('footer.navigation')}</h4>
            <ul className="space-y-4">
              <li><Link to="/formations" className="text-white/80 hover:text-white text-sm transition-colors font-medium">{t('navbar.formations')}</Link></li>
              <li><Link to="/services" className="text-white/80 hover:text-white text-sm transition-colors font-medium">{t('navbar.services')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8">{t('footer.contact')}</h4>
            <ul className="space-y-5">
              <li className="flex items-center text-white/80 group">
                <Phone className="w-4 h-4 mr-4 text-white/50" />
                <span className="text-sm font-medium transition-colors group-hover:text-white">{settings.contact_phone || "+213 550 79 64 64"}</span>
              </li>
              <li className="flex items-center text-white/80 group">
                <Mail className="w-4 h-4 mr-4 text-white/50" />
                <span className="text-sm font-medium transition-colors group-hover:text-white underline decoration-white/20 underline-offset-4">{settings.contact_email || "focmeds@gmail.com"}</span>
              </li>
              <li className="flex items-start text-white/80 group">
                <MapPin className="w-4 h-4 mr-4 text-white/50 mt-0.5" />
                <span className="text-sm italic transition-colors group-hover:text-white whitespace-pre-line">{settings.contact_address || "Alger, Algérie"}</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8">{t('footer.newsletter')}</h4>
            <p className="text-white/60 text-xs mb-6 italic">{t('footer.newsletterSub')}</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 text-sm placeholder:text-white/20 italic"
              />
              <button
                type="submit"
                className="w-full bg-blue-400 text-white font-bold text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-blue-300 transition-all shadow-lg active:scale-95"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} {settings.footer_copyright || "Foc.Med.s Agency"}. {t('footer.rights')}
          </p>
          <div className="flex gap-8 text-white/20 text-[9px] uppercase tracking-widest font-black">
            {settings.privacy_url ? (
              <a href={settings.privacy_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            ) : (
              <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            )}
            
            {settings.terms_url ? (
              <a href={settings.terms_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.legal')}</a>
            ) : (
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors">{t('footer.legal')}</Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
