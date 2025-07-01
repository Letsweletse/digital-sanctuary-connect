
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SermonHeader from '@/components/sermons/SermonHeader';
import FilterBar from '@/components/sermons/FilterBar';
import ViewSelector from '@/components/sermons/ViewSelector';
import SermonGridView from '@/components/sermons/SermonGridView';
import SermonListView from '@/components/sermons/SermonListView';
import LatestSermonCard from '@/components/sermons/LatestSermonCard';
import SermonSeriesList from '@/components/sermons/SermonSeriesList';
import { useSermons } from '@/hooks/useSermons';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sermons = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { sermons, isLoading, error, refreshSermons } = useSermons();
  const {
    filteredSermons,
    speakers,
    series,
    searchTerm,
    selectedSpeaker,
    selectedSeries,
    selectedTags,
    availableTags,
    setSearchTerm,
    setSelectedSpeaker,
    setSelectedSeries,
    setSelectedTags,
    clearAllFilters
  } = useSermonFilters(sermons);

  const latestSermon = sermons.length > 0 ? sermons[0] : null;

  if (error) {
    return (
      <Layout>
        <main className="flex-grow pt-24 page-transition">
          <SermonHeader totalSermons={sermons.length} />
          
          <section className="py-16">
            <div className="container mx-auto px-4">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold mb-2">No Sermons Available</h3>
                  <p className="text-muted-foreground mb-6">
                    {error}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={refreshSermons} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button asChild>
                      <Link to="/admin">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Sermons
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow pt-24 page-transition">
        <SermonHeader totalSermons={sermons.length} />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 mr-2" />
                <span>Loading sermons...</span>
              </div>
            ) : sermons.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold mb-2">No Sermons Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Sermons will appear here once they are uploaded through the admin panel.
                  </p>
                  <Button asChild>
                    <Link to="/admin">
                      <Upload className="h-4 w-4 mr-2" />
                      Go to Admin Panel
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {latestSermon && (
                  <div className="mb-12">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-church-blue to-church-blue-dark rounded-lg p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Latest Sermon</h2>
                        <h3 className="text-xl mb-2">{latestSermon.title}</h3>
                        <p className="text-church-blue-light">by {latestSermon.speaker}</p>
                      </div>
                    </div>
                  </div>
                )}

                {series.length > 0 && (
                  <div className="mb-12">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {series.slice(0, 6).map((seriesName) => (
                          <div key={seriesName} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-church-neutral-900 mb-2">{seriesName}</h3>
                            <p className="text-sm text-church-neutral-600 mb-3">
                              {sermons.filter(s => s.series === seriesName).length} sermons
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedSeries(seriesName)}
                            >
                              View Series
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <h2 className="text-2xl font-bold">All Sermons</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        Grid
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        List
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Search sermons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedSpeaker}
                        onChange={(e) => setSelectedSpeaker(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">All Speakers</option>
                        {speakers.map(speaker => (
                          <option key={speaker} value={speaker}>{speaker}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedSeries}
                        onChange={(e) => setSelectedSeries(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">All Series</option>
                        {series.map(seriesName => (
                          <option key={seriesName} value={seriesName}>{seriesName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Button variant="outline" onClick={clearAllFilters} className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {filteredSermons.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg text-muted-foreground">
                        No sermons match your current filters.
                      </p>
                      <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                        Clear All Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      {viewMode === 'grid' ? (
                        <SermonGridView sermons={filteredSermons} />
                      ) : (
                        <SermonListView sermons={filteredSermons} />
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Sermons;
