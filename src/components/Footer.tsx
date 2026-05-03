import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  return (
    <footer className="bg-brand-bg border-t border-gray-100 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-1">
            {settings.footerLogo ? (
              <a href={settings.logoLink} className="block h-16 mb-8">
                <img src={settings.footerLogo} alt="Logo" className="h-full w-auto object-contain" />
              </a>
            ) : (
              <Link to="/" className="text-3xl font-black text-[#3B2A8F] mb-8 block tracking-tighter">
                CLINISPHERE
              </Link>
            )}
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-[#3B2A8F]/5 flex items-center justify-center text-[#3B2A8F] hover:bg-[#3B2A8F] hover:text-white transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#3B2A8F]/40 uppercase tracking-[0.3em] mb-10">{t('footer.links')}</h4>
            <ul className="space-y-4">
              <li><Link to="/formations" className="text-[#3B2A8F]/60 font-black text-xs uppercase tracking-widest hover:text-[#3B2A8F] transition-colors">{t('navbar.formations')}</Link></li>
              <li><Link to="/boutique" className="text-[#3B2A8F]/60 font-black text-xs uppercase tracking-widest hover:text-[#3B2A8F] transition-colors">{t('navbar.boutique')}</Link></li>
              <li><Link to="/services" className="text-[#3B2A8F]/60 font-black text-xs uppercase tracking-widest hover:text-[#3B2A8F] transition-colors">{t('navbar.services')}</Link></li>
              <li><Link to="/contact" className="text-[#3B2A8F]/60 font-black text-xs uppercase tracking-widest hover:text-[#3B2A8F] transition-colors">{t('navbar.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#3B2A8F]/40 uppercase tracking-[0.3em] mb-10">{t('footer.contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start text-gray-400 group">
                <MapPin className="w-5 h-5 mr-4 text-[#3B2A8F] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">12 Rue des Médecins, Alger, Algérie</span>
              </li>
              <li className="flex items-center text-gray-400 group">
                <Phone className="w-5 h-5 mr-4 text-[#3B2A8F] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">+213 (0) 555 00 00 00</span>
              </li>
              <li className="flex items-center text-gray-400 group">
                <Mail className="w-5 h-5 mr-4 text-[#3B2A8F] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">contact@clinisphere.dz</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#3B2A8F]/40 uppercase tracking-[0.3em] mb-10">{t('footer.newsletter')}</h4>
            <p className="text-gray-400 text-sm mb-8 font-medium">{t('footer.newsletterDesc')}</p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="EMAIL"
                className="w-full bg-[#3B2A8F]/5 border-none px-6 py-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3B2A8F]/5 text-xs font-black uppercase tracking-widest text-[#3B2A8F] placeholder:text-[#3B2A8F]/20"
              />
              <button
                type="submit"
                className="w-full bg-[#3B2A8F] text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-[#2d1f70] transition-all shadow-xl shadow-[#3B2A8F]/20 active:scale-95"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#3B2A8F]/20 text-[10px] uppercase tracking-widest font-black">
            &copy; {new Date().getFullYear()} Clinisphere LMS. All rights reserved.
          </p>
          <div className="flex gap-8 text-[#3B2A8F]/20 text-[9px] uppercase tracking-[0.2em] font-black">
            <a href="#" className="hover:text-[#3B2A8F]">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-[#3B2A8F]">{t('footer.legal')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
