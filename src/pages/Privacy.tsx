import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function Privacy() {
  const { settings } = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 md:py-24 bg-brand-bg min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Privacy Policy</h1>
          
          {settings.privacy_html ? (
            <div 
              className="prose prose-blue max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-blue-600 space-y-6 whitespace-pre-line break-words"
              dangerouslySetInnerHTML={{ __html: settings.privacy_html }}
            />
          ) : (
            <p className="text-gray-500 italic">Privacy Policy has not been set yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
