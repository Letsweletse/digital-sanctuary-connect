
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SermonGrid from '@/components/sermons/SermonGrid';

const Sermons = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-church-blue-light py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Sermons & Teachings
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Weekly Messages
              </h1>
              <p className="text-lg text-church-neutral-700">
                Explore our sermon archive for teachings on faith, grace, and living out God's Word. 
                Watch online, download audio, or subscribe for updates.
              </p>
            </div>
          </div>
        </section>
        
        {/* Sermons Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <SermonGrid />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sermons;
