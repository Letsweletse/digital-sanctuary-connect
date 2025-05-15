
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check for mobile
    const checkIsMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      return mobile;
    };

    // Check on mount
    const initialCheckResult = checkIsMobile();
    console.log(`Initial device detection: ${initialCheckResult ? 'mobile' : 'desktop'}`);
    
    // Set up resize listener with debouncing to improve performance
    let resizeTimer: number | undefined;
    const handleResize = () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
      
      resizeTimer = window.setTimeout(() => {
        const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
        if (newIsMobile !== isMobile) {
          console.log(`Screen size changed, now: ${newIsMobile ? 'mobile' : 'desktop'}`);
          setIsMobile(newIsMobile);
          
          // Dispatch an event to notify components about device change
          window.dispatchEvent(new CustomEvent('device-changed', { 
            detail: { isMobile: newIsMobile }
          }));
        }
      }, 150); // Debounce for better performance
    };
    
    window.addEventListener("resize", handleResize);
    
    // Force a refresh for mobile components when orientation changes
    const handleOrientationChange = () => {
      console.log('Orientation changed, refreshing components');
      // Clear any pending resize timer
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
      
      // Force a refresh check after orientation change completes
      setTimeout(checkIsMobile, 100);
      
      // Trigger refresh events for components that need to update
      window.dispatchEvent(new Event('sermon-refresh'));
      window.dispatchEvent(new CustomEvent('image-refresh'));
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (resizeTimer) {
        window.clearTimeout(resizeTimer);
      }
    };
  }, [isMobile]);

  return isMobile === undefined ? false : isMobile;
}
