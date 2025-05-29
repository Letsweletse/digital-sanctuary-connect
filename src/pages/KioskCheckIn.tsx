
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKioskCheckIn } from '@/hooks/useKioskCheckIn';
import KioskHeader from '@/components/kiosk/KioskHeader';
import CheckInOptions from '@/components/kiosk/CheckInOptions';
import CheckInForm from '@/components/kiosk/CheckInForm';
import QRScanner from '@/components/kiosk/QRScanner';
import SuccessMessage from '@/components/kiosk/SuccessMessage';
import NotActivatedMessage from '@/components/kiosk/NotActivatedMessage';

const KioskCheckIn = () => {
  const {
    currentStep,
    setCurrentStep,
    attendeeName,
    isKioskActive,
    isLoading,
    checkIn,
    resetToIdle
  } = useKioskCheckIn();

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (currentStep !== 'idle' && currentStep !== 'success') {
        idleTimer = setTimeout(() => {
          resetToIdle();
        }, 10000); // 10 seconds of inactivity
      }
    };

    const handleActivity = () => {
      resetIdleTimer();
    };

    // Listen for user activity
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, [currentStep, resetToIdle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-church-blue to-church-blue-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isKioskActive) {
    return <NotActivatedMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-church-blue to-church-blue-dark overflow-hidden">
      <div className="container mx-auto px-8 py-12 h-screen flex flex-col">
        <KioskHeader />
        
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 'idle' && (
              <CheckInOptions
                key="options"
                onSelectMethod={(method) => setCurrentStep(method)}
              />
            )}
            
            {currentStep === 'manual' && (
              <CheckInForm
                key="form"
                onCheckIn={checkIn}
                onBack={() => setCurrentStep('idle')}
              />
            )}
            
            {currentStep === 'qr' && (
              <QRScanner
                key="qr"
                onCheckIn={checkIn}
                onBack={() => setCurrentStep('idle')}
              />
            )}
            
            {currentStep === 'success' && (
              <SuccessMessage
                key="success"
                attendeeName={attendeeName}
                onDone={() => setCurrentStep('idle')}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KioskCheckIn;
