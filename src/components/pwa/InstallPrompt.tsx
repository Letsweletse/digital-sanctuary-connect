import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Don't show in iframes (Lovable preview)
    try {
      if (window.self !== window.top) return;
    } catch { return; }

    // Check if already dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Don't show for 7 days after dismiss
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // iOS detection
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS guide after 5 seconds
      const timer = setTimeout(() => setShowBanner(true), 5000);
      return () => clearTimeout(timer);
    }

    // Android/Desktop - listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-lg mx-auto bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white rounded-2xl shadow-2xl p-4 relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-xl p-2.5 shrink-0">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1">Install Gate Gaborone</h3>
            <p className="text-white/80 text-sm mb-3">
              Add to your home screen for quick access to events, sermons & more.
            </p>

            {isIOS ? (
              <>
                {!showIOSGuide ? (
                  <Button
                    onClick={() => setShowIOSGuide(true)}
                    size="sm"
                    className="bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold"
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Show me how
                  </Button>
                ) : (
                  <div className="bg-white/10 rounded-lg p-3 text-sm space-y-1.5">
                    <p>1. Tap the <strong>Share</strong> button <span className="inline-block">⎋</span> at the bottom</p>
                    <p>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                    <p>3. Tap <strong>"Add"</strong> to confirm</p>
                  </div>
                )}
              </>
            ) : deferredPrompt ? (
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Install App
              </Button>
            ) : (
              <p className="text-white/70 text-xs">
                Open in Chrome or Edge to install this app.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
