
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
          {/* Sermons Card - Solid Blue Background */}
          <div ref={sermonsRef} className="opacity-0 overflow-hidden group rounded-xl shadow-xl bg-white">
            <div className="relative h-48 bg-[#0EA5E9]">
              {/* Icon Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-500 animate-[float_3s_ease-in-out_infinite]">
                  <Book className="h-8 w-8 text-[#0EA5E9]" />
                </div>
              </div>
              
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Sermons</h3>
            </div>
            <div className="p-6 bg-white">
              <p className="text-church-neutral-700 mb-4">
                Watch and listen to our latest teachings to grow in your understanding of God's Word.
              </p>
              <Link to="/sermons" className="inline-block bg-white hover:bg-[#0EA5E9] hover:text-white border border-[#0EA5E9] text-[#0EA5E9] px-4 py-2 rounded-lg transition-colors duration-300">
                Browse Sermons
              </Link>
            </div>
          </div>
          
          {/* House Church Card - Solid Gold Background */}
          <div ref={houseChurchRef} className="opacity-0 overflow-hidden group rounded-xl shadow-xl bg-white">
            <div className="relative h-48 bg-[#e6c98f]">
              {/* Icon Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-500 animate-[float_3s_ease-in-out_infinite]" style={{animationDelay: "0.2s"}}>
                  <Home className="h-8 w-8 text-[#e6c98f]" />
                </div>
              </div>
              
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">House Church</h3>
            </div>
            <div className="p-6 bg-white">
              <p className="text-church-neutral-700 mb-4">
                Join our small group ministry for fellowship, prayer, and deeper Bible study in a home setting.
              </p>
              <Link to="/house-church" className="inline-block bg-white hover:bg-[#e6c98f] hover:text-white border border-[#e6c98f] text-[#e6c98f] px-4 py-2 rounded-lg transition-colors duration-300">
                Find a Group
              </Link>
            </div>
          </div>
          
          {/* Leadership Card - Solid Gray Background */}
          <div ref={leadershipRef} className="opacity-0 overflow-hidden group rounded-xl shadow-xl bg-white">
            <div className="relative h-48 bg-[#8E9196]">
              {/* Icon Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-500 animate-[float_3s_ease-in-out_infinite]" style={{animationDelay: "0.4s"}}>
                  <Users className="h-8 w-8 text-[#8E9196]" />
                </div>
              </div>
              
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Leadership</h3>
            </div>
            <div className="p-6 bg-white">
              <p className="text-church-neutral-700 mb-4">
                Meet the leadership team that guides our church family with wisdom, vision and a heart for God.
              </p>
              <Link to="/leadership" className="inline-block bg-white hover:bg-[#8E9196] hover:text-white border border-[#8E9196] text-[#8E9196] px-4 py-2 rounded-lg transition-colors duration-300">
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
