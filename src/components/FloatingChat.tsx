import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Whatsapp, Messenger, Telegram } from './CustomIcons';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingChat() {
  const { settings } = useSettings();

  if (!settings.floating_chat_enabled) return null;

  const IconComponent = () => {
    switch (settings.floating_chat_icon) {
      case 'whatsapp':
        return <Whatsapp size={32} />;
      case 'messenger':
        return <Messenger size={32} />;
      case 'telegram':
        return <Telegram size={32} />;
      case 'custom':
      default:
        return settings.floating_chat_custom_icon ? (
          <img src={settings.floating_chat_custom_icon || undefined} alt="Chat" className="w-full h-full object-cover rounded-full" />
        ) : (
          <MessageCircle size={32} />
        );
    }
  };

  const getColorClass = () => {
    switch (settings.floating_chat_icon) {
      case 'whatsapp':
        return 'bg-[#25D366] hover:bg-[#1DA851]';
      case 'messenger':
        return 'bg-[#0084FF] hover:bg-[#006BCE]';
      case 'telegram':
        return 'bg-[#0088cc] hover:bg-[#006699]';
      case 'custom':
      default:
        return 'bg-[#1E3A8A] hover:bg-blue-800';
    }
  };

  return (
    <AnimatePresence>
      <motion.a
        href={settings.floating_chat_url || "#"}
        target={settings.floating_chat_url ? "_blank" : "_self"}
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-300 ${getColorClass()}`}
        style={{ boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)' }}
      >
        <IconComponent />
      </motion.a>
    </AnimatePresence>
  );
}
