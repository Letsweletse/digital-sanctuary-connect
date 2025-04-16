
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import LeadershipGrid from '@/components/leadership/LeadershipGrid';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Leadership = () => {
  // Fetch leaders from MongoDB with improved error handling
  const { data: leaders, isLoading, error } = useMongoData<LeadershipPerson>('leaders', {});
  
  useEffect(() => {
    if (error) {
      console.error('Error loading leadership data:', error);
      toast.error('Failed to load leadership data. Please try refreshing the page.');
    }
  }, [error]);
  
  return (
    <Layout>
      <main className="flex-grow page-transition">
        <section className="bg-gradient-to-b from-[#24324b] via-[#1c2a40] to-[#162035] text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white mb-4">
                Our Team
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Leadership Team
              </h1>
              <p className="text-lg text-white/80">
                Meet the dedicated servants who lead our church with vision, wisdom and a heart for God's people.
              </p>
            </div>
          </div>
        </section>
        
        {isLoading ? (
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-64 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <LeadershipGrid leaders={leaders || []} />
        )}
      </main>
    </Layout>
  );
};

export default Leadership;
