
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
      <main className="flex-grow pt-24 bg-white page-transition">
        {isLoading ? (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-64 w-64 rounded-full mb-4" />
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
