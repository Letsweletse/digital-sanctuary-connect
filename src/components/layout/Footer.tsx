
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-church-blue text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div>
            <Link to="/" className="text-xl font-bold flex items-center gap-1 mb-4">
              <span className="text-church-gold">Gate</span>Gaborone
            </Link>
            <p className="text-white/80 mb-4">
              An apostolic center in the heart of Botswana's economic capital, strategically positioned to align with biblical patterns.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61575319345710" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-church-gold transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.twitter.com" className="text-white/70 hover:text-church-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://www.instagram.com" className="text-white/70 hover:text-church-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.youtube.com/@gategaboronebotswana2702" className="text-white/70 hover:text-church-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/sermons" className="text-white/80 hover:text-church-gold transition-colors">Sermons</Link></li>
              <li><Link to="/events" className="text-white/80 hover:text-church-gold transition-colors">Events Calendar</Link></li>
              <li><Link to="/leadership" className="text-white/80 hover:text-church-gold transition-colors">Our Leadership</Link></li>
              <li><Link to="/house-church" className="text-white/80 hover:text-church-gold transition-colors">House Church</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-church-gold transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          {/* Service Times */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Service Times</h3>
            <ul className="space-y-3">
              <li className="text-white/80">
                <span className="font-medium block">Sunday Services</span>
                <span>8:30 AM & 11:00 AM</span>
              </li>
              <li className="text-white/80">
                <span className="font-medium block">Wednesday Housechurch</span>
                <span>6:30 PM - 8:00 PM</span>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-white/80">
                <span className="font-medium">Address:</span>
                <span className="block">Gate Gaborone Auditorium</span>
                <span className="block">Gaborone West, Phase 4, Plot 54014</span>
              </li>
              <li className="text-white/80">
                <span className="font-medium">Phone:</span>
                <span className="block">+267 3500194 / +267 75507981</span>
              </li>
              <li className="text-white/80">
                <span className="font-medium">Email:</span>
                <span className="block">otenggate@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Gate Gaborone. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-white/50 hover:text-church-gold text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-white/50 hover:text-church-gold text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
