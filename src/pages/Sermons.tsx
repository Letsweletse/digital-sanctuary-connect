
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useSermons } from '@/hooks/useSermons';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import SermonHeader from '@/components/sermons/SermonHeader';
import FilterBar from '@/components/sermons/FilterBar';
import ViewSelector from '@/components/sermons/ViewSelector';

const Sermons = () => {
  const { sermons } = useSermons();
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

  return (
    <Layout>
      <main className="flex-grow py-10 md:py-16 bg-white page-transition">
        <div className="container mx-auto px-4">
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
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
