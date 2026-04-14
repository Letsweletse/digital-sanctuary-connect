
import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Crown, Star } from 'lucide-react';

const KioskHeader = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Premium background with conference imagery */}
      <div className="absolute inset-0 bg-gradient-to-br from-church-blue via-church-blue-dark to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Conference background pattern */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt="Conference Background" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center py-12 px-8"
      >
        {/* Premium conference branding */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            {/* Main logo container */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6 shadow-2xl border-4 border-church-gold">
              <UserCheck className="h-12 w-12 text-church-blue" />
            </div>
            {/* Premium accent */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-church-gold rounded-full flex items-center justify-center shadow-lg"
            >
              <Crown className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>

          <div className="text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold text-white mb-2 tracking-tight"
            >
              Gate Gaborone
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Star className="h-5 w-5 text-church-gold" />
              <span className="text-church-gold font-semibold text-lg">Premium Conference Experience</span>
            </motion.div>
          </div>
        </div>

        {/* Conference title and details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-bold text-white mb-2">
            Perspectives on the Apostolic
          </h2>
          <div className="flex items-center justify-center space-x-8 text-white/90">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-church-gold rounded-full"></div>
              <span className="text-xl">Saturday, 9 May 2026</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-church-gold rounded-full"></div>
              <span className="text-xl">Gate Gaborone</span>
            </div>
          </div>
          <p className="text-2xl text-white/80 font-light">Conference Check-In</p>
        </motion.div>

        {/* Premium decorative elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-2 border-church-gold/30 rounded-full"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-church-gold/30 rounded-full"></div>
        <div className="absolute top-1/2 left-4 w-2 h-2 bg-church-gold/50 rounded-full"></div>
        <div className="absolute top-1/3 right-6 w-2 h-2 bg-church-gold/50 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default KioskHeader;
