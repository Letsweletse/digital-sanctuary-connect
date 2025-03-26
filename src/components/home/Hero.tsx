
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-church-blue-dark/70 to-church-blue-dark/70 z-10"></div>
        {/* Replace with actual video when available */}
        <div className="w-full h-full bg-church-blue bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-church-gold px-3 py-1 rounded-full text-sm font-medium text-church-neutral-900 mb-6 animate-fade-in">
            Welcome to Gate Gaborone
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in tracking-wider">
            GATE GABORONE
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            An apostolic center in the heart of Botswana's economic capital,
            strategically positioned to align with biblical patterns and model
            the Kingdom of God.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <a href="https://www.youtube.com/@gategaboronebotswana2702" target="_blank" rel="noopener noreferrer" className="btn-accent w-full sm:w-auto">
              Watch Live
            </a>
            <Link to="/sermons" className="btn-outline bg-white/10 text-white hover:bg-white/20 w-full sm:w-auto">
              Sermon Archive
            </Link>
            <Link to="/events" className="btn-outline bg-white/10 text-white hover:bg-white/20 w-full sm:w-auto">
              Upcoming Events
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
