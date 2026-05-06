import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Header section */}
      <section className="py-24 pt-32 text-center max-w-4xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight"
        >
          {t('services_page.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
        >
          {t('services_page.desc')}
        </motion.p>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-32 space-y-32">
        {/* Course 1: Colposcopy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://hkbkvnaptnhkoghuredj.supabase.co/storage/v1/object/public/media/1.png" 
              alt="Colposcopy Training" 
              className="rounded-3xl shadow-2xl w-full"
            />
            <div className="absolute inset-0 bg-[#3b2a8f]/5 rounded-3xl" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 italic">
              {t('services_page.courses.colpo.title')}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {t('services_page.courses.colpo.desc')}
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-8 list-disc pl-5">
              {(t('services_page.courses.colpo.list', { returnObjects: true }) as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="space-y-4 pt-6 border-t border-gray-100 italic font-medium text-sm text-[#08678C]">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>{t('services_page.courses.colpo.locations.l1')}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>{t('services_page.courses.colpo.locations.l2')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course 2: Prolapsus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:order-2"
          >
            <img 
              src="https://hkbkvnaptnhkoghuredj.supabase.co/storage/v1/object/public/media/2.png" 
              alt="Vaginal Surgery" 
              className="rounded-3xl shadow-2xl w-full"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:order-1"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 italic uppercase tracking-tight">
              {t('services_page.courses.prolapsus.title')}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('services_page.courses.prolapsus.desc')}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {t('services_page.courses.prolapsus.desc2')}
            </p>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h4 className="font-bold text-gray-900 mb-4 text-sm">{t('services_page.courses.prolapsus.objectives')}</h4>
              <ul className="space-y-3 text-sm text-gray-600 italic">
                {(t('services_page.courses.prolapsus.list', { returnObjects: true }) as string[]).map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Course 3: Hysteroscopy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://hkbkvnaptnhkoghuredj.supabase.co/storage/v1/object/public/media/3.png" 
              alt="Hysteroscopy Training" 
              className="rounded-3xl shadow-2xl w-full"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 italic uppercase tracking-tight">
              {t('services_page.courses.hystero.title')}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('services_page.courses.hystero.desc')}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {t('services_page.courses.hystero.desc2')}
            </p>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm underline decoration-blue-400 decoration-2 underline-offset-4">
                {t('services_page.courses.hystero.indications')}
              </h4>
              <p className="text-sm text-gray-600 italic leading-relaxed">
                {t('services_page.courses.hystero.list')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-[#fafafa] py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8 italic">{t('services_page.contact.title')}</h2>
              <p className="text-gray-500 mb-12 max-w-sm">
                {t('services_page.contact.desc')}
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#08678C]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('services_page.contact.labels.phone')}</p>
                    <p className="font-bold">+213 550 79 64 64</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#08678C]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('services_page.contact.labels.email')}</p>
                    <p className="font-bold">focmeds@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 space-y-8">
                <div className="p-8 bg-white rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                  <h4 className="text-[10px] font-bold text-[#08678C] uppercase tracking-widest mb-4">{t('services_page.contact.hours.title')}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    {t('services_page.contact.hours.desc')}
                  </p>
                </div>
                
                <div className="p-8 bg-white rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                  <h4 className="text-[10px] font-bold text-[#08678C] uppercase tracking-widest mb-4">{t('services_page.contact.locations.title')}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    {t('services_page.contact.locations.desc')}
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-4">{t('services_page.contact.commitment.title')}</p>
                  <p className="text-gray-500 text-xs italic leading-relaxed">
                    {t('services_page.contact.commitment.desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100">
               <form className="space-y-8">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">{t('services_page.contact.form.name')}</label>
                  <input 
                    type="text" 
                    placeholder={t('services_page.contact.form.namePlaceholder')} 
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-[#08678C]/10 text-sm italic"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">{t('services_page.contact.form.email')}</label>
                  <input 
                    type="email" 
                    placeholder={t('services_page.contact.form.emailPlaceholder')} 
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-[#08678C]/10 text-sm italic"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#1D72B8] text-white font-bold py-4 px-12 rounded-full text-sm inline-flex items-center gap-3 hover:bg-[#165a91] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  {t('services_page.contact.form.submit')}
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

