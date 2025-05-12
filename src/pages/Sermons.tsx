
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useSermons } from '@/hooks/useSermons';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import SermonHeader from '@/components/sermons/SermonHeader';
import FilterBar from '@/components/sermons/FilterBar';
import ViewSelector from '@/components/sermons/ViewSelector';

const Sermons = () => {
  const { sermons, loading, error } = useSermons();
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
    activeView,
    setActiveView,
    allTopics,
    allSpeakers,
    allYears
  } = useSermonFilters(sermons);

  // Debug logs to track data flow
  useEffect(() => {
    console.log('Sermons page - Loaded sermons:', sermons?.length || 0);
    console.log('Sermons page - Filtered sermons:', filteredSermons?.length || 0);
    if (sermons?.length > 0) {
      console.log('Sermons page - Sample sermon:', sermons[0]);
    }
    console.log('Sermons page - Loading state:', loading);
    if (error) console.error('Sermons page - Error:', error);
  }, [sermons, filteredSermons, loading, error]);

  return (
    <Layout>
      <main className="flex-grow py-10 md:py-16 bg-white page-transition">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-church-neutral-600">Loading sermons...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-red-50 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
              <p className="text-church-neutral-500 text-sm mt-2">Please try refreshing the page.</p>
            </div>
          ) : sermons?.length === 0 ? (
            <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
              <p className="text-church-neutral-600">No sermons found. Please add some sermons to your library.</p>
            </div>
          ) : (
            <>
              {/* Page Header */}
              <SermonHeader totalSermons={filteredSermons.length} />
              
              {/* Search & Filters */}
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
              
              {/* View options */}
              <ViewSelector
                activeView={activeView}
                setActiveView={setActiveView}
                filteredSermons={filteredSermons}
              />
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
