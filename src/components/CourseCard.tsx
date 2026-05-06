import React from 'react';
import { ShoppingCart, Star, Clock, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Price from './Price';

interface CourseCardProps {
  key?: React.Key;
  course: Course;
  onAddToCart?: (course: Course) => void;
  ctaText?: string;
  showPrice?: boolean;
}

export default function CourseCard({ course, onAddToCart, ctaText, showPrice = true }: CourseCardProps) {
  const { t, i18n } = useTranslation();
  const defaultCtaText = t('course.enroll');
  const finalCtaText = ctaText || defaultCtaText;

  const thumbnail = course.thumbnail || (course as any).image;

  const courseTitle = i18n.language === 'fr' 
    ? (course.title_fr || course.title_en || course.title) 
    : (course.title_en || course.title_fr || course.title);
    
  const courseDescription = i18n.language === 'fr'
    ? (course.shortDescription_fr || course.shortDescription_en || course.shortDescription || (course as any).description)
    : (course.shortDescription_en || course.shortDescription_fr || course.shortDescription || (course as any).description);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[#3B2A8F]/10 transition-all border border-gray-100 flex flex-col h-full group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={thumbnail}
          alt={courseTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {showPrice && (
          <div className="absolute top-6 right-6 bg-[#3B2A8F] px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md">
            <Price amount={course.price} className="text-white text-sm font-black tracking-tight" />
          </div>
        )}
        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur-md text-[#3B2A8F] text-[10px] uppercase font-black px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg border border-white/50">
            {t('course.badge')}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-8 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          {course.instructorId && (
            <Link 
              to={`/instructors/${course.instructorId}`}
              className="flex items-center group/inst"
            >
              {course.instructorImage ? (
                <img src={course.instructorImage} alt={course.instructorName} className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50 group-hover/inst:ring-blue-100 transition-all" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
                  <GraduationCap size={14} />
                </div>
              )}
              <div className="ml-3">
                <span className="text-[10px] font-black text-[#3B2A8F]/40 uppercase tracking-[0.2em] block">{t('course.instructor')}</span>
                <span className="text-xs font-bold text-[#3B2A8F] group-hover/inst:text-blue-600 transition-colors uppercase tracking-tight">{course.instructorName}</span>
              </div>
            </Link>
          )}
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#3B2A8F]/20">
             <GraduationCap size={16} />
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-[#3B2A8F] mb-3 leading-[1.2] tracking-tighter transition-colors">
          {courseTitle}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow font-medium">
          {courseDescription}
        </p>

        <div className="space-y-6 pt-6 border-t border-gray-50">
          <div className="flex items-center justify-between text-[11px] font-black text-[#3B2A8F]/30 uppercase tracking-[0.15em]">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{t('course.unlimited')}</span>
            </div>
            <div className="flex items-center text-[#3B2A8F]">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-[#3B2A8F]/60">4.9 / 5</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart?.(course)}
            className="w-full bg-[#3B2A8F] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-[#2d1f70] transition-all shadow-xl shadow-[#3B2A8F]/20 active:scale-95"
          >
            {(finalCtaText === t('course.addToCart') || finalCtaText === "Ajouter au panier" || finalCtaText === "Add to cart") && <ShoppingCart className="w-5 h-5" />}
            <span>{finalCtaText}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

