
import React, { createContext, useState, useContext, useEffect } from 'react';

interface LogoContextType {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
}

const LogoContext = createContext<LogoContextType>({
  logoUrl: null,
  setLogoUrl: () => {},
});

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Load the logo URL from localStorage on initial render
  useEffect(() => {
    const savedLogo = localStorage.getItem('churchLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    } else {
      // Set default logo
      setLogoUrl('/lovable-uploads/99b68414-6dbc-47ce-bc8d-47a1e42b5c5f.png');
    }
  }, []);

  // Save the logo URL to localStorage whenever it changes
  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('churchLogo', logoUrl);
    }
  }, [logoUrl]);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => useContext(LogoContext);
