
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Home, Users } from 'lucide-react';

const FeaturedSections: React.FC = () => {
  // Refs for animation
  const sermonsRef = useRef<HTMLDivElement>(null);
  const houseChurchRef = useRef<HTMLDivElement>(null);
  const leadershipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simple animation for the cards when they appear in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe all section cards
    if (sermonsRef.current) observer.observe(sermonsRef.current);
    if (houseChurchRef.current) observer.observe(houseChurchRef.current);
    if (leadershipRef.current) observer.observe(leadershipRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  // Animation for icon floating
  const iconAnimation = "animate-[float_3s_ease-in-out_infinite]";
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#24324b]/10 to-church-blue-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4 shadow-sm">
            Explore More
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
            Get Connected
          </h2>
          <p className="max-w-2xl mx-auto text-church-neutral-700">
            Discover different ways to get involved and grow in your faith journey at Gate Gaborone Ministries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sermons Card with 3D Animation */}
          <div ref={sermonsRef} className="opacity-0 glass-panel overflow-hidden group rounded-xl shadow-xl border border-white/20 backdrop-blur-sm">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                alt="Sermons" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* 3D Animated Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`bg-[#e6c98f] rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-500 ${iconAnimation}`}>
                  <Book className="h-8 w-8 text-[#24324b]" />
                </div>
              </div>
              
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Sermons</h3>
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-church-neutral-50">
              <p className="text-church-neutral-700 mb-4">
                Watch and listen to our latest teachings to grow in your understanding of God's Word.
              </p>
              <Link to="/sermons" className="btn-outline inline-block bg-white hover:bg-[#e6c98f] hover:text-white border border-[#e6c98f] text-[#24324b] px-4 py-2 rounded-lg transition-colors duration-300">
                Browse Sermons
              </Link>
            </div>
          </div>
          
          {/* House Church Card with 3D Animation */}
          <div ref={houseChurchRef} className="opacity-0 glass-panel overflow-hidden group rounded-xl shadow-xl border border-white/20 backdrop-blur-sm">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                alt="House Church" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* 3D Animated Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`bg-[#e6c98f] rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-500 ${iconAnimation}`} style={{animationDelay: "0.2s"}}>
                  <Home className="h-8 w-8 text-[#24324b]" />
                </div>
              </div>
              
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">House Church</h3>
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-church-neutral-50">
              <p className="text-church-neutral-700 mb-4">
                Join our small group ministry for fellowship, prayer, and deeper Bible study in a home setting.
              </p>
              <Link to="/house-church" className="btn-outline inline-block bg-white hover:bg-[#e6c98f] hover:text-white border border-[#e6c98f] text-[#24324b] px-4 py-2 rounded-lg transition-colors duration-300">
                Find a Group
              </Link>
            </div>
          </div>
          
          {/* Leadership Card with 3D Animation */}
          <div ref={leadershipRef} className="opacity-0 glass-panel overflow-hidden group rounded-xl shadow-xl border border-white/20 backdrop-blur-sm">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80" 
                alt="Leadership" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* 3D Animated Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`bg-[#e6c98f] rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-500 ${iconAnimation}`} style={{animationDelay: "0.4s"}}>
                  <Users className="h-8 w-8 text-[#24324b]" />
                </div>
              </div>
              
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Leadership</h3>
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-church-neutral-50">
              <p className="text-church-neutral-700 mb-4">
                Meet the leadership team that guides our church family with wisdom, vision and a heart for God.
              </p>
              <Link to="/leadership" className="btn-outline inline-block bg-white hover:bg-[#e6c98f] hover:text-white border border-[#e6c98f] text-[#24324b] px-4 py-2 rounded-lg transition-colors duration-300">
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSections;
