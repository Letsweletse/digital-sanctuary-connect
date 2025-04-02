
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLogo } from '@/components/layout/LogoContext';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  
  // Add scroll event listener to change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={cn(
      "fixed w-full top-0 left-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow" : "bg-white/80 backdrop-blur-md"
    )}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            {logoContext?.logoUrl && (
              <img
                src={logoContext.logoUrl}
                alt="Logo"
                className="h-10 w-auto mr-2 transition-all hover:opacity-90"
              />
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        {isMobile ? (
          <button 
            onClick={toggleMenu} 
            className="text-gray-500 hover:text-church-blue focus:outline-none transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        ) : (
          /* Desktop Menu */
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
            <NavLink to="/about" currentPath={location.pathname}>About</NavLink>
            <NavLink to="/sermons" currentPath={location.pathname}>Sermons</NavLink>
            <NavLink to="/events" currentPath={location.pathname}>Events</NavLink>
            <NavLink to="/leadership" currentPath={location.pathname}>Leadership</NavLink>
            <NavLink to="/house-church" currentPath={location.pathname}>House Church</NavLink>
            <NavLink to="/contact" currentPath={location.pathname}>Contact</NavLink>
            <Link to="/give" className="bg-church-blue hover:bg-church-blue-dark text-white px-5 py-2 rounded-md font-medium transition-all duration-300 hover:shadow-md">Give</Link>
          </div>
        )}
      </div>

      {/* Mobile Menu (Conditional Rendering) */}
      {isMobile && isMenuOpen && (
        <div className="bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-6 py-4 space-y-1">
            <MobileNavLink to="/" currentPath={location.pathname} onClick={closeMenu}>Home</MobileNavLink>
            <MobileNavLink to="/about" currentPath={location.pathname} onClick={closeMenu}>About</MobileNavLink>
            <MobileNavLink to="/sermons" currentPath={location.pathname} onClick={closeMenu}>Sermons</MobileNavLink>
            <MobileNavLink to="/events" currentPath={location.pathname} onClick={closeMenu}>Events</MobileNavLink>
            <MobileNavLink to="/leadership" currentPath={location.pathname} onClick={closeMenu}>Leadership</MobileNavLink>
            <MobileNavLink to="/house-church" currentPath={location.pathname} onClick={closeMenu}>House Church</MobileNavLink>
            <MobileNavLink to="/contact" currentPath={location.pathname} onClick={closeMenu}>Contact</MobileNavLink>
            <div className="pt-2 pb-3">
              <Link 
                to="/give" 
                className="block w-full bg-church-blue hover:bg-church-blue-dark text-white text-center py-3 rounded-md font-medium transition-all duration-300"
                onClick={closeMenu}
              >
                Give
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for desktop navigation links
const NavLink = ({ to, currentPath, children }: { to: string, currentPath: string, children: React.ReactNode }) => {
  const isActive = currentPath === to;
  return (
    <Link 
      to={to} 
      className={cn(
        "relative font-medium transition-all duration-300 hover:text-church-blue",
        "after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:bg-church-blue after:transition-all after:duration-300",
        isActive ? "text-church-blue after:w-full" : "after:w-0 hover:after:w-full"
      )}
    >
      {children}
    </Link>
  );
};

// Helper component for mobile navigation links
const MobileNavLink = ({ to, currentPath, onClick, children }: { to: string, currentPath: string, onClick: () => void, children: React.ReactNode }) => {
  const isActive = currentPath === to;
  return (
    <Link 
      to={to} 
      className={cn(
        "block py-3 px-4 rounded-md transition-all duration-200",
        isActive ? "bg-church-blue-light/20 text-church-blue font-medium" : "hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
