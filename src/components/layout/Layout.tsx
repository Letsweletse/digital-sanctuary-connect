
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LogoProvider } from './LogoContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LogoProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </LogoProvider>
  );
};

export default Layout;
