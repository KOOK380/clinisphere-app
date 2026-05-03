import { useEffect, useState } from 'react';
import { Course, CartItem, User } from '../types';
import CourseCard from '../components/CourseCard';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BoutiqueProps {
  cart: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (id: number) => void;
  user: User | null;
}

export default function Boutique({ cart, addToCart, removeFromCart, user }: BoutiqueProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const { t, i18n } = useTranslation();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('API returned non-array data:', data);
          setCourses([]);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setCourses([]);
      });
  }, []);

  return (
    <div className="py-12 md:py-24 bg-brand-bg min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[#3B2A8F]/40 font-black tracking-[0.3em] uppercase text-[10px] block mb-3 md:mb-6">{t('boutique.badge')}</span>
              <h1 className="text-3xl md:text-6xl font-black text-[#3B2A8F] mb-3 md:mb-6 tracking-tighter">{t('boutique.title')}</h1>
              <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl">{t('boutique.desc')}</p>
            </div>
            {cart.length > 0 && (
              <Link 
                to="/cart"
                className="inline-flex items-center space-x-4 bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-[#3B2A8F]/5 rounded-xl flex items-center justify-center relative">
                  <ShoppingBag className="w-5 h-5 text-[#3B2A8F]" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white">
                    {cart.length}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-[#3B2A8F]/40 tracking-widest">{t('boutique.cart.title')}</p>
                  <p className="text-[#3B2A8F] font-black text-sm">{total} DZD</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#3B2A8F]/40 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onAddToCart={addToCart} 
              ctaText={t('course.addToCart')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
