
import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

const KioskHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4"
        >
          <UserCheck className="h-10 w-10 text-church-blue" />
        </motion.div>
        <h1 className="text-6xl font-bold text-white">Gate Gaborone</h1>
      </div>
      <p className="text-2xl text-white/90">Event Check-In</p>
    </motion.div>
  );
};

export default KioskHeader;
