
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogo } from './LogoContext';
import { useImageLibrary } from '@/hooks/useImageLibrary';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const { logoUrl } = useLogo();
  const { uploadedImages } = useImageLibrary('general');
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Sermons', path: '/sermons' },
    { title: 'Leadership', path: '/leadership' },
    { title: 'House Church', path: '/house-church' },
    { title: 'Events', path: '/events' },
    { title: 'Give', path: '/give' },
    { title: 'Contact', path: '/contact' },
  ];

  // Find the logo image from uploaded images
  const logoImage = uploadedImages.find(img => img.name.toLowerCase().includes('logo'));
  
  const handleLogoError = () => {
    console.error('Logo failed to load:', logoUrl);
    setLogoError(true);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center gap-2"
          >
            {logoUrl && !logoError ? (
              <img 
                src={logoUrl} 
                alt="Gate Gaborone Logo" 
                className="h-10 md:h-12"
                onError={handleLogoError}
              />
            ) : logoImage ? (
              <img 
                src={logoImage.url} 
                alt="Gate Gaborone" 
                className="h-10 md:h-12" 
                onError={() => {
                  console.error('Logo image failed to load');
                  setLogoError(true);
                }}
              />
            ) : (
              <img 
                src="/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png" 
                alt="Gate Gaborone" 
                className="h-10 md:h-12" 
                onError={() => {
                  console.error('Default logo failed to load');
                  setLogoError(true);
                }}
              />
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-church-neutral-100 text-church-neutral-800"
                    : "text-church-neutral-700 hover:bg-church-neutral-100"
                )}
              >
                {link.title}
              </Link>
            ))}
            <a
              href="https://www.youtube.com/@gategaboronebotswana2702"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 btn-accent"
            >
              Watch Live
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-church-neutral-700 hover:bg-church-neutral-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-church-neutral-200 animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-3 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-church-neutral-100 text-church-neutral-800"
                      : "text-church-neutral-700 hover:bg-church-neutral-100"
                  )}
                >
                  {link.title}
                </Link>
              ))}
              <a
                href="https://www.youtube.com/@gategaboronebotswana2702"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent text-center mt-4"
              >
                Watch Live
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
