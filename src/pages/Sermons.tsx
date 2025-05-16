
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useSermons } from '@/hooks/useSermons';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import SermonHeader from '@/components/sermons/SermonHeader';
import FilterBar from '@/components/sermons/FilterBar';
import ViewSelector from '@/components/sermons/ViewSelector';
import SermonSeriesList from '@/components/sermons/SermonSeriesList'; // Import the new component
import { Card, CardContent } from '@/components/ui/card';

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
      <main className="flex-grow py-10 md:py-16 bg-church-neutral-50 page-transition">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-2 border-church-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-church-neutral-600">Loading sermons...</p>
            </div>
          ) : error ? (
            <Card className="mx-auto max-w-2xl bg-red-50 border-red-200">
              <CardContent className="text-center py-10">
                <p className="text-red-600 mb-2">Error: {error}</p>
                <p className="text-church-neutral-500 text-sm">Please try refreshing the page.</p>
              </CardContent>
            </Card>
          ) : sermons?.length === 0 ? (
            <Card className="mx-auto max-w-2xl bg-church-neutral-50">
              <CardContent className="text-center py-10">
                <p className="text-church-neutral-600 mb-4">No sermons found in your library.</p>
                <p className="text-church-neutral-500 text-sm">Please add some sermons to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              {/* Left Sidebar for desktop */}
              <div className="hidden lg:block lg:col-span-2">
                <div className="sticky top-24 overflow-auto pr-4 pb-8 max-h-[calc(100vh-120px)]">
                  <div className="bg-white rounded-lg shadow-sm border border-church-neutral-200 p-4 mb-6">
                    <h3 className="font-semibold text-church-neutral-800 mb-3 border-b pb-2">Find Sermons</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="sidebar-search" className="text-sm font-medium text-church-neutral-700 mb-1 block">
                          Search
                        </label>
                        <input
                          id="sidebar-search"
                          type="text"
                          placeholder="Search sermons..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-church-neutral-200 rounded-md text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="sidebar-speaker" className="text-sm font-medium text-church-neutral-700 mb-1 block">
                          Speaker
                        </label>
                        <select
                          id="sidebar-speaker"
                          value={selectedSpeaker}
                          onChange={(e) => setSelectedSpeaker(e.target.value)}
                          className="w-full px-3 py-2 border border-church-neutral-200 rounded-md text-sm"
                        >
                          <option value="all">All Speakers</option>
                          {allSpeakers.map((speaker) => (
                            <option key={speaker} value={speaker}>
                              {speaker}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="sidebar-topic" className="text-sm font-medium text-church-neutral-700 mb-1 block">
                          Topic
                        </label>
                        <select
                          id="sidebar-topic"
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          className="w-full px-3 py-2 border border-church-neutral-200 rounded-md text-sm"
                        >
                          <option value="all">All Topics</option>
                          {allTopics.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="sidebar-year" className="text-sm font-medium text-church-neutral-700 mb-1 block">
                          Year
                        </label>
                        <select
                          id="sidebar-year"
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="w-full px-3 py-2 border border-church-neutral-200 rounded-md text-sm"
                        >
                          <option value="all">All Years</option>
                          {allYears.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border border-church-neutral-200 p-4">
                    <h3 className="font-semibold text-church-neutral-800 mb-3 border-b pb-2">Sermon Series</h3>
                    {/* Replace the previous static content with the SermonSeriesList component */}
                    <SermonSeriesList sermons={sermons} />
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="lg:col-span-5">
                {/* Page Header */}
                <SermonHeader totalSermons={filteredSermons.length} />
                
                {/* Mobile Search & Filters */}
                <div className="lg:hidden mb-6">
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
                </div>
                
                {/* Sermon Views */}
                <div className="bg-white rounded-lg shadow-sm border border-church-neutral-200 p-4 md:p-6">
                  <ViewSelector filteredSermons={filteredSermons} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
