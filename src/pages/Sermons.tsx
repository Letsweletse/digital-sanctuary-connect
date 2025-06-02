
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useDualSermons } from '@/hooks/useDualSermons';
import SermonHeader from '@/components/sermons/SermonHeader';
import FilterBar from '@/components/sermons/FilterBar';
import ViewSelector from '@/components/sermons/ViewSelector';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Sermons = () => {
  const { sermons, loading, error } = useDualSermons();
  const {
    filteredSermons,
    searchTerm,
    setSearchTerm,
    selectedTopic,
    setSelectedTopic,
    selectedSpeaker,
    setSelectedSpeaker,
    selectedYear,
    setSelectedYear,
    allTopics,
    allSpeakers,
    allYears
  } = useSermonFilters(sermons);

  if (loading) {
    return (
      <Layout>
        <main className="flex-grow py-10 md:py-16 bg-church-neutral-50 page-transition">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-4xl">
              <CardContent className="text-center py-16">
                <Loader2 className="h-16 w-16 text-church-blue mx-auto mb-6 animate-spin" />
                <h1 className="text-2xl font-bold text-church-neutral-800 mb-4">
                  Loading Sermons...
                </h1>
                <p className="text-church-neutral-600">
                  Please wait while we fetch the latest sermons from our database.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="flex-grow py-10 md:py-16 bg-church-neutral-50 page-transition">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-4xl bg-red-50 border-red-200">
              <CardContent className="text-center py-16">
                <div className="text-red-600 mb-6">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-red-800 mb-4">
                  Unable to Load Sermons
                </h1>
                <p className="text-red-700 mb-4">
                  We're experiencing difficulty connecting to our sermon database.
                </p>
                <p className="text-red-600 text-sm">
                  Error: {error}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow py-10 md:py-16 bg-church-neutral-50 page-transition">
        <div className="container mx-auto px-4">
          <SermonHeader totalSermons={sermons.length} />
          
          <div className="max-w-6xl mx-auto space-y-6">
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
              selectedSpeaker={selectedSpeaker}
              setSelectedSpeaker={setSelectedSpeaker}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              allTopics={allTopics}
              allSpeakers={allSpeakers}
              allYears={allYears}
            />
            
            <ViewSelector filteredSermons={filteredSermons} />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
