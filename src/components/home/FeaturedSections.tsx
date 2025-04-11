
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedSections: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-church-blue-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
            Explore More
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
            Get Connected
          </h2>
          <p className="max-w-2xl mx-auto text-church-neutral-700">
            Discover different ways to get involved and grow in your faith journey at Gate Gaborone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sermons Card */}
          <div className="glass-panel overflow-hidden group">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                alt="Sermons" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Sermons</h3>
            </div>
            <div className="p-6">
              <p className="text-church-neutral-700 mb-4">
                Watch and listen to our latest teachings to enhance growth in your understanding of God's Word.
              </p>
              <Link to="/sermons" className="btn-outline inline-block">
                Browse Sermons
              </Link>
            </div>
          </div>
          
          {/* House Church Card */}
          <div className="glass-panel overflow-hidden group">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                alt="House Church" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">House Church</h3>
            </div>
            <div className="p-6">
              <p className="text-church-neutral-700 mb-4">
                Join our Wednesday's small groups ministry for fellowship, prayer, and deeper Bible study in a home setting.
              </p>
              <Link to="/house-church" className="btn-outline inline-block">
                Find your House Church
              </Link>
            </div>
          </div>
          
          {/* Leadership Card */}
          <div className="glass-panel overflow-hidden group">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80" 
                alt="Leadership" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Leadership</h3>
            </div>
            <div className="p-6">
              <p className="text-church-neutral-700 mb-4">
                Meet the leadership team that guides our church family with wisdom, vision and a heart for God.
              </p>
              <Link to="/leadership" className="btn-outline inline-block">
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
