import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CheckoutFailure() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#fafaf9] flex items-center justify-center">
      <div className="max-w-md w-full px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-12 h-12 text-red-600" />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Payment Failed</h1>
          <p className="text-lg text-gray-600 mb-8">
            Unfortunately, your payment could not be processed. Please try again or contact support.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/payment"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-bold tracking-wide hover:bg-gray-800 transition-colors"
            >
              Try Again
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold tracking-wide hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
