
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeadershipGrid from '@/components/leadership/LeadershipGrid';

const Leadership = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        <section className="py-16 bg-church-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-blue mb-4">
                Our Team
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Leadership
              </h1>
              <p className="text-lg text-white/90">
                Meet the dedicated team that guides Gate Gaborone. Our leaders are committed to serving our community with wisdom and compassion.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <LeadershipGrid />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leadership;
