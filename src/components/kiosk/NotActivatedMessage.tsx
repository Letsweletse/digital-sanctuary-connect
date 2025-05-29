
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Settings } from 'lucide-react';

const NotActivatedMessage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 max-w-2xl mx-auto px-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto"
        >
          <AlertTriangle className="h-12 w-12 text-white" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Kiosk Mode Not Activated
          </h1>
          <p className="text-xl text-gray-300">
            The check-in kiosk is currently not active. Please contact an administrator to enable kiosk mode.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-gray-400" />
            <span className="text-gray-300">Administrator Instructions</span>
          </div>
          <p className="text-gray-400 text-sm">
            To activate kiosk mode, log in to the admin panel and enable the kiosk toggle in the event configuration section.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotActivatedMessage;
