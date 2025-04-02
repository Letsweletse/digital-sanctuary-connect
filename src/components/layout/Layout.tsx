
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LogoProvider } from './LogoContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isEventPage = location.pathname === '/events';

  return (
    <LogoProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className={`flex-grow ${isEventPage ? 'pt-16' : 'pt-20'}`}>
          {children}
        </main>
        <Footer />
      </div>
    </LogoProvider>
  );
};

export default Layout;
