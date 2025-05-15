
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check for mobile
    const checkIsMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      console.log(`Device detected as: ${mobile ? 'mobile' : 'desktop'}`);
      return mobile;
    };

    // Check on mount and set up listeners
    const mobile = checkIsMobile();
    
    // Set up resize listener
    const handleResize = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (newIsMobile !== isMobile) {
        console.log(`Screen size changed, now: ${newIsMobile ? 'mobile' : 'desktop'}`);
        setIsMobile(newIsMobile);
      }
    };
    
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  return !!isMobile;
}
