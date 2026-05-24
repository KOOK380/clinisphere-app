import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CheckoutSuccess({ clearCart }: { clearCart?: () => void }) {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.removeItem('cart');
    if (clearCart) clearCart();
    window.dispatchEvent(new Event('cartUpdated'));
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#fafaf9] flex items-center justify-center">
      <div className="max-w-md w-full px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{t('boutique.order.successTitle')}</h1>
          <p className="text-lg text-gray-600 mb-8">
            {orderId ? t('boutique.order.successDesc', { orderId }) : t('boutique.order.successDesc').replace(' #{{orderId}}', '')}<br/>
            {t('boutique.order.successEmail')}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold tracking-wide hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            {t('boutique.order.backDashboard')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
