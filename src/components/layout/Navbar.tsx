
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Sermons', path: '/sermons' },
    { title: 'Leadership', path: '/leadership' },
    { title: 'House Church', path: '/house-church' },
    { title: 'About', path: '/about' },
    { title: 'Events', path: '/events' },
    { title: 'Contact', path: '/contact' },
  ];
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-church-blue/90 backdrop-blur-md shadow-sm py-4 text-white" : "bg-transparent py-6 text-white"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center gap-2"
          >
            <span className="text-church-gold">Gate</span>Gaborone
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
                    ? "bg-church-blue-light text-church-blue-dark"
                    : "text-white hover:bg-white/10"
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
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-church-blue border-t border-white/10 animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-3 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-church-blue-light text-church-blue-dark"
                      : "text-white hover:bg-white/10"
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
