
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLogo } from './LogoContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { logo } = useLogo();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed w-full z-50 transition-colors duration-300 bg-white text-church-neutral-800 shadow-sm`}>
      <div className="container mx-auto">
        <nav className="flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            {logo ? (
              <img 
                src={logo} 
                alt="Gate Gaborone Ministries" 
                className="h-12 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                  console.error('Error loading logo image');
                }}
              />
            ) : (
              <img 
                src="/placeholder.svg" 
                alt="Gate Gaborone Ministries" 
                className="h-12 w-auto"
              />
            )}
            <span className="text-lg font-bold text-church-neutral-800">Gate Gaborone</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Home
            </Link>
            
            <Link 
              to="/about"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/about') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              About
            </Link>
            
            <Link 
              to="/sermons"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/sermons') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Sermons
            </Link>
            
            <Link 
              to="/events"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/events') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Events
            </Link>
            
            <Link 
              to="/house-church"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/house-church') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              House Church
            </Link>
            
            <Link 
              to="/leadership"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/leadership') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Leadership
            </Link>
            
            <Link 
              to="/give"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/give') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Give
            </Link>
            
            <Link 
              to="/contact"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/contact') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Contact
            </Link>
            
            <Link 
              to="/admin"
              className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 hover:text-church-neutral-900 ${
                isActive('/admin') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
              }`}
            >
              Admin
            </Link>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-church-neutral-700 hover:text-church-neutral-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg transform transition-transform duration-300 ease-in-out absolute w-full ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col px-4 py-2 space-y-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          
          <Link
            to="/about"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/about') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            About
          </Link>
          
          <Link
            to="/sermons"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/sermons') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Sermons
          </Link>
          
          <Link
            to="/events"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/events') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Events
          </Link>
          
          <Link
            to="/house-church"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/house-church') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            House Church
          </Link>
          
          <Link
            to="/leadership"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/leadership') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Leadership
          </Link>
          
          <Link
            to="/give"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/give') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Give
          </Link>
          
          <Link
            to="/contact"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/contact') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
          
          <Link
            to="/admin"
            className={`px-3 py-2 rounded text-church-neutral-700 hover:bg-church-neutral-100 ${
              isActive('/admin') ? 'bg-church-neutral-100 text-church-neutral-900 font-medium' : ''
            }`}
            onClick={closeMobileMenu}
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
