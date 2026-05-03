import { motion } from 'motion/react';
import { Plus, Minus, Shield, HelpCircle, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: t('services.faq.q1'),
      a: t('services.faq.a1')
    },
    {
      q: t('services.faq.q2'),
      a: t('services.faq.a2')
    },
    {
      q: t('services.faq.q3'),
      a: t('services.faq.a3')
    },
    {
      q: t('services.faq.q4'),
      a: t('services.faq.a4')
    }
  ];

  return (
    <div className="py-24 bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-20"
        >
          <span className="text-[#3b2a8f] font-bold tracking-widest uppercase text-sm block mb-4">{t('services.badge')}</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">{t('services.title')}</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            {t('services.desc')}
          </p>
        </motion.div>

        {/* FAQ Section */}
        <div className="mb-32">
          <div className="flex items-center space-x-4 mb-10">
            <HelpCircle className="w-8 h-8 text-[#3b2a8f]" />
            <h2 className="text-3xl font-bold text-gray-900 italic">{t('services.faq.title')}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center group"
                >
                  <span className="font-bold text-lg text-gray-800 group-hover:text-[#3b2a8f] transition-colors">{faq.q}</span>
                  {openFaq === i ? (
                    <Minus className="w-5 h-5 text-[#3b2a8f]" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-300" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-8 pb-8 text-gray-500 leading-relaxed font-medium"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Terms Section */}
        <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-gray-100 shadow-xl">
          <div className="flex items-center space-x-4 mb-10">
            <FileText className="w-8 h-8 text-[#3b2a8f]" />
            <h2 className="text-3xl font-bold text-gray-900 italic">{t('services.terms.title')}</h2>
          </div>
          
          <div className="space-y-10">
            <section>
              <h3 className="text-xl font-bold font-sans text-[#3b2a8f] mb-4">{t('services.terms.s1.title')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {t('services.terms.s1.desc')}
              </p>
            </section>

             <section>
              <h3 className="text-xl font-bold font-sans text-[#3b2a8f] mb-4">{t('services.terms.s2.title')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {t('services.terms.s2.desc')}
              </p>
            </section>

             <section>
              <h3 className="text-xl font-bold font-sans text-[#3b2a8f] mb-4">{t('services.terms.s3.title')}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {t('services.terms.s3.desc')}
              </p>
            </section>
          </div>

          <div className="mt-16 pt-10 border-t border-gray-50 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600 font-bold text-sm uppercase tracking-widest">
              <Shield className="w-5 h-5" />
              <span>{t('services.terms.certified')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
