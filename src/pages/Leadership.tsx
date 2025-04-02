
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeadershipGrid from '@/components/leadership/LeadershipGrid';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';

const Leadership = () => {
  // Fetch leaders from MongoDB
  const { data: leaders, isLoading } = useMongoData<LeadershipPerson>('leaders', {});
  
  // Debug log to see if we're getting data
  console.log('Leadership page loaded, leaders data:', leaders?.length || 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        <section className="py-16 bg-indigo-100 text-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-indigo-700 mb-4">
                Our Team
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Leadership
              </h1>
              <p className="text-lg text-black/90">
                Meet the dedicated team that guides Gate Gaborone. Our leaders are committed to serving our community with wisdom and compassion.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <LeadershipGrid leaders={leaders || []} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leadership;
