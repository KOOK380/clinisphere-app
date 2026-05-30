import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { motion } from 'motion/react';

export default function About() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <div className="bg-white min-h-[60vh] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg max-w-none text-gray-800"
        >
          {settings.about_us_html ? (
            <div dangerouslySetInnerHTML={{ __html: settings.about_us_html }} />
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-[#3B2A8F] mb-6">{t('aboutPage.title')}</h1>
              <p>{t('aboutPage.desc')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
