
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onCheckIn: (identifier: string, method: 'qr') => Promise<boolean>;
  onBack: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onCheckIn, onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions and try again.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualEntry = () => {
    // For demo purposes, simulate QR code scanning with updated location
    const demoEmail = 'demo@gategaborone.com';
    onCheckIn(demoEmail, 'qr');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-12 shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-church-blue mb-4">
          Scan QR Code
        </h2>
        <p className="text-xl text-church-neutral-600">
          Position your QR code in front of the camera
        </p>
      </div>

      <div className="space-y-8">
        {!isScanning ? (
          <div className="text-center space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}
            
            <Button
              onClick={startCamera}
              className="w-full h-16 bg-church-blue hover:bg-church-blue-dark text-xl font-semibold rounded-xl"
            >
              <Camera className="mr-3 h-6 w-6" />
              Start Camera
            </Button>
            
            <Button
              onClick={handleManualEntry}
              variant="outline"
              className="w-full h-16 text-xl font-semibold rounded-xl border-2"
            >
              Demo Check-In
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 border-4 border-church-blue rounded-xl pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white rounded-lg"></div>
              </div>
            </div>
            
            <Button
              onClick={stopCamera}
              variant="outline"
              className="w-full h-16 text-xl font-semibold rounded-xl border-2"
            >
              Stop Camera
            </Button>
          </div>
        )}

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-16 text-xl font-semibold rounded-xl border-2"
        >
          <ArrowLeft className="mr-3 h-6 w-6" />
          Back
        </Button>
      </div>
    </motion.div>
  );
};

export default QRScanner;
