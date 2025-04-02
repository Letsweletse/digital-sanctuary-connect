
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Welcome from '@/components/home/Welcome';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <Hero />
        
        {/* Welcome Section */}
        <Welcome />
        
        {/* Featured Event - Perspectives on the Apostolic */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Featured Event
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Perspectives on the Apostolic
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                Join us for this special conference exploring apostolic ministry in the modern church. 
                Featuring powerful teachings, workshops, and fellowship.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="glass-panel overflow-hidden group">
                <div className="relative h-72 md:h-96">
                  <img 
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                    alt="Perspectives on the Apostolic" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800">
                      Conference
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Perspectives on the Apostolic</h3>
                    <p className="text-white/90 mb-4">May 10, 2025 at 9:00 AM - 1:30 PM | Gate Gaborone Auditorium</p>
                    <Link to="/events" className="btn-primary inline-block">
                      Register Now
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xl font-semibold text-church-neutral-900 mb-2">Event Details</h4>
                      <p className="text-church-neutral-700 mb-4">
                        A special conference exploring apostolic ministry in the modern church. Join us for powerful teachings, workshops, and fellowship.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-church-neutral-900 mb-2">What to Expect</h4>
                      <ul className="list-disc list-inside text-church-neutral-700 space-y-1">
                        <li>Insightful teaching from apostolic leaders</li>
                        <li>Interactive workshops and discussions</li>
                        <li>Powerful worship and ministry</li>
                        <li>Networking with like-minded believers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Sections Links */}
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
                Discover different ways to get involved and grow in your faith journey at Gate Gaborone Ministries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sermons Card */}
              <div className="glass-panel overflow-hidden group">
                <div className="relative h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                    alt="Sermons" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">Sermons</h3>
                </div>
                <div className="p-6">
                  <p className="text-church-neutral-700 mb-4">
                    Watch and listen to our latest teachings to grow in your understanding of God's Word.
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
                    Join our small group ministry for fellowship, prayer, and deeper Bible study in a home setting.
                  </p>
                  <Link to="/house-church" className="btn-outline inline-block">
                    Find a Group
                  </Link>
                </div>
              </div>
              
              {/* Leadership Card */}
              <div className="glass-panel overflow-hidden group">
                <div className="relative h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80" 
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
      </div>
    </Layout>
  );
};

export default Index;
