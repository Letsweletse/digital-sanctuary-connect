
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLogo } from '@/components/layout/LogoContext';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const logoContext = useLogo();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Function to close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close the menu when the location changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            {logoContext?.logoUrl && (
              <img
                src={logoContext.logoUrl}
                alt="Logo"
                className="h-8 w-auto mr-2"
              />
            )}
            <span className="font-bold text-xl">Gate Gaborone</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        {isMobile ? (
          <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        ) : (
          /* Desktop Menu */
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <Link to="/about" className="hover:text-gray-700">About</Link>
            <Link to="/sermons" className="hover:text-gray-700">Sermons</Link>
            <Link to="/events" className="hover:text-gray-700">Events</Link>
            <Link to="/leadership" className="hover:text-gray-700">Leadership</Link>
            <Link to="/house-church" className="hover:text-gray-700">House Church</Link>
            <Link to="/contact" className="hover:text-gray-700">Contact</Link>
            <Link to="/give" className="btn-primary">Give</Link>
          </div>
        )}
      </div>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMobile && isMenuOpen && (
        <div className="bg-gray-50 p-4">
          <Link to="/" className="block py-2 hover:text-gray-700" onClick={closeMenu}>Home</Link>
          <Link to="/about" className="block py-2 hover:text-gray-700" onClick={closeMenu}>About</Link>
          <Link to="/sermons" className="block py-2 hover:text-gray-700" onClick={closeMenu}>Sermons</Link>
          <Link to="/events" className="block py-2 hover:text-gray-700" onClick={closeMenu}>Events</Link>
          <Link to="/leadership" className="block py-2 hover:text-gray-700" onClick={closeMenu}>Leadership</Link>
          <Link to="/house-church" className="block py-2 hover:text-gray-700" onClick={closeMenu}>House Church</Link>
          <Link to="/contact" className="block py-2 hover:text-gray-700" onClick={closeMenu}>Contact</Link>
          <Link to="/give" className="block py-2 hover:text-gray-700" onClick={closeMenu}>Give</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
