
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, QrCode, Users, Clock } from 'lucide-react';

interface CheckInOptionsProps {
  onSelectMethod: (method: 'manual' | 'qr') => void;
}

const CheckInOptions: React.FC<CheckInOptionsProps> = ({ onSelectMethod }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center space-y-12 max-w-6xl mx-auto"
    >
      {/* Conference image showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mb-12"
      >
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-church-gold/20">
          <img 
            src="/lovable-uploads/poa-november-2025.jpeg"
            alt="Perspectives on the Apostolic" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome to the Conference</h3>
            <p className="text-white/90">Experience transformation through apostolic principles</p>
          </div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold text-white mb-8"
      >
        How would you like to check in?
      </motion.h2>

      {/* Quick info panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <Users className="h-8 w-8 text-church-gold mb-2 mx-auto" />
          <p className="text-white text-sm">Expected Attendees</p>
          <p className="text-white font-bold text-xl">200+</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <Clock className="h-8 w-8 text-church-gold mb-2 mx-auto" />
          <p className="text-white text-sm">Registration Open</p>
          <p className="text-white font-bold text-xl">Now</p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onSelectMethod('manual')}
            className="w-full h-48 bg-white/95 hover:bg-white text-church-blue hover:text-church-blue-dark text-2xl font-bold rounded-3xl shadow-2xl border-2 border-church-gold/30 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-church-blue rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Enter Details</div>
                <div className="text-lg text-church-neutral-600 font-normal">Email or Phone Number</div>
              </div>
            </div>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onSelectMethod('qr')}
            className="w-full h-48 bg-white/95 hover:bg-white text-church-blue hover:text-church-blue-dark text-2xl font-bold rounded-3xl shadow-2xl border-2 border-church-gold/30 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-church-blue rounded-full flex items-center justify-center">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Scan QR Code</div>
                <div className="text-lg text-church-neutral-600 font-normal">Quick & Easy</div>
              </div>
            </div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckInOptions;
