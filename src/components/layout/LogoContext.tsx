
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Load the logo URL from Supabase or localStorage on initial render
  useEffect(() => {
    const fetchLogoFromSupabase = async () => {
      try {
        // Try to get the logo from Supabase first
        const { data, error } = await supabase
          .from('images')
          .select('url')
          .eq('category', 'logo')
          .order('uploaded_at', { ascending: false })
          .limit(1)
          .single();
        
        if (data && data.url) {
          setLogoUrl(data.url);
          // Cache the logo URL in localStorage
          localStorage.setItem('churchLogo', data.url);
          return;
        }
      } catch (error) {
        console.log('Error fetching logo from Supabase:', error);
      }
      
      // Fallback to localStorage if Supabase fails or has no logo
      const savedLogo = localStorage.getItem('churchLogo');
      if (savedLogo) {
        setLogoUrl(savedLogo);
      } else {
        // Set default logo
        setLogoUrl('/lovable-uploads/99b68414-6dbc-47ce-bc8d-47a1e42b5c5f.png');
      }
    };
    
    fetchLogoFromSupabase();
  }, []);

  // Save the logo URL to localStorage and Supabase whenever it changes
  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('churchLogo', logoUrl);
      
      // Don't try to update Supabase if it's just the default logo
      if (!logoUrl.includes('/lovable-uploads/')) {
        // Store in Supabase (without awaiting to not block UI)
        const updateSupabase = async () => {
          try {
            // Check if this URL already exists
            const { data } = await supabase
              .from('images')
              .select('id')
              .eq('url', logoUrl)
              .eq('category', 'logo');
            
            if (!data || data.length === 0) {
              // If not exists, insert it
              await supabase.from('images').insert({
                name: 'Church Logo',
                url: logoUrl,
                category: 'logo',
                uploaded_at: new Date().toISOString()
              });
            }
          } catch (error) {
            console.log('Error saving logo to Supabase:', error);
            // Continue silently - we already saved to localStorage as fallback
          }
        };
        
        updateSupabase();
      }
    }
  }, [logoUrl]);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => useContext(LogoContext);
