
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-church-blue-light py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Our Story
              </h1>
              <p className="text-lg text-church-neutral-700">
                Learn about Gate Gaborone Ministries' journey and the values that 
                guide our church community.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                  Our Mission & Vision
                </h2>
                <div className="space-y-4 text-church-neutral-700">
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-2">Our Mission</h3>
                    <p>
                      To help people experience God's grace, grow in faith, and discover 
                      their purpose through Jesus Christ.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-2">Our Vision</h3>
                    <p>
                      To be a community where lives are transformed by God's love, 
                      creating a movement of grace that impacts our city and beyond.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-2">Our Values</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Biblical Teaching & Spiritual Growth</li>
                      <li>Authentic Community & Relationships</li>
                      <li>Passionate Worship & Prayer</li>
                      <li>Compassionate Service & Outreach</li>
                      <li>Excellence & Integrity in All We Do</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-church-blue-light rounded-tl-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-church-gold-light rounded-br-2xl"></div>
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1601142958639-bdcd4f235256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                    alt="Church Community" 
                    className="rounded-xl shadow-card w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-16 bg-church-neutral-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-church-neutral-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-church-neutral-700 mb-8 max-w-2xl mx-auto">
              Have questions about Gate Gaborone Ministries? We'd love to hear from you.
            </p>
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
