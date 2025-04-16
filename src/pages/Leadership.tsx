
import React from 'react';
import Layout from '@/components/layout/Layout';
import LeadershipGrid from '@/components/leadership/LeadershipGrid';
import { LeadershipPerson } from '@/types/leadershipTypes';
import useMongoData from '@/hooks/useMongoData';

const Leadership = () => {
  // Fetch leaders from MongoDB
  const { data: leaders, isLoading } = useMongoData<LeadershipPerson>('leaders', {});
  
  return (
    <Layout>
      <main className="flex-grow pt-24 bg-white page-transition">
        <LeadershipGrid leaders={leaders || []} />
      </main>
    </Layout>
  );
};

export default Leadership;
