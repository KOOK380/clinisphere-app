import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CreditCard, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartItem, User } from '../types';
import Price from '../components/Price';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  user: User | null;
}

export default function Cart({ cart, removeFromCart, user }: CartProps) {
  const { t } = useTranslation();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="py-24 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link to="/boutique" className="inline-flex items-center space-x-2 text-[#3B2A8F]/40 hover:text-[#3B2A8F] transition-colors font-black uppercase text-[10px] tracking-widest mb-8 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{t('boutique.cart.backToStore')}</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#3B2A8F]/40 font-black tracking-[0.3em] uppercase text-[10px] block mb-4">{t('boutique.cart.badge')}</span>
              <h1 className="text-4xl md:text-6xl font-black text-[#3B2A8F] tracking-tighter flex items-center gap-4">
                {t('boutique.cart.title')}
                <span className="bg-[#3B2A8F]/5 text-[#3B2A8F] text-xs font-black px-4 py-2 rounded-2xl uppercase tracking-widest translate-y-1">
                  {cart.length} {t('boutique.cart.items')}
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="space-y-6">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-16 text-center shadow-3xl border border-gray-100"
              >
                <div className="w-24 h-24 bg-[#3B2A8F]/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingCart className="w-10 h-10 text-[#3B2A8F]/20" />
                </div>
                <h2 className="text-2xl font-black text-[#3B2A8F] mb-4 tracking-tight">{t('boutique.cart.empty')}</h2>
                <Link 
                  to="/boutique"
                  className="inline-flex bg-[#3B2A8F] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  Explorer les formations
                </Link>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-3xl border border-gray-100">
                  <div className="space-y-10">
                    <AnimatePresence mode="popLayout">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 group border-b border-gray-50 pb-10 last:border-0 last:pb-0"
                        >
                          <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg border border-gray-100">
                            <img src={item.thumbnail || (item as any).image || undefined} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h4 className="text-xl font-black text-[#3B2A8F] tracking-tight">
                                {t(`course.items.${item.title}.title`, item.title)}
                              </h4>
                              <Price amount={item.price} className="text-xl font-black text-[#3B2A8F] mt-2 md:mt-0" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-6 line-clamp-2 max-w-xl">
                              {t(`course.items.${item.title}.desc`, item.shortDescription)}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-xl">
                                <span className="text-[10px] font-black text-[#3B2A8F]/40 uppercase tracking-widest">Quantité</span>
                                <span className="font-black text-[#3B2A8F]">{item.quantity}</span>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="flex items-center space-x-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-black uppercase text-[10px] tracking-widest"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-12 shadow-3xl border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[#3B2A8F]/40 text-[10px] font-black uppercase tracking-widest">
                          <span>{t('boutique.cart.subtotal')}</span>
                          <Price amount={total} />
                        </div>
                        <div className="flex justify-between items-center text-[#3B2A8F] font-black text-2xl tracking-tighter">
                          <span>{t('boutique.cart.total')}</span>
                          <Price amount={total} className="text-4xl" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <Link 
                        to={user ? "/checkout" : "/login?redirect=/cart"}
                        className="w-full py-6 rounded-[1.5rem] bg-[#3B2A8F] text-white hover:bg-[#2d1f70] font-black uppercase tracking-widest text-[11px] flex items-center justify-center space-x-4 transition-all shadow-2xl shadow-[#3B2A8F]/20 active:scale-95"
                      >
                        <span>{t('boutique.cart.checkout')}</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <div className="flex items-center justify-center gap-8 text-[10px] text-[#3B2A8F]/30 font-black uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          <span>{t('boutique.cart.secure')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
