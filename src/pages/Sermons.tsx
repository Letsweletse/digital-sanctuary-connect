
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
                    <LatestSermonCard sermon={latestSermon} />
                  </div>
                )}

                {series.length > 0 && (
                  <div className="mb-12">
                    <SermonSeriesList 
                      series={series} 
                      sermons={sermons}
                      onSeriesSelect={setSelectedSeries}
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <h2 className="text-2xl font-bold">All Sermons</h2>
                    <ViewSelector viewMode={viewMode} onViewModeChange={setViewMode} />
                  </div>

                  <FilterBar
                    searchTerm={searchTerm}
                    selectedSpeaker={selectedSpeaker}
                    selectedSeries={selectedSeries}
                    selectedTags={selectedTags}
                    speakers={speakers}
                    series={series}
                    availableTags={availableTags}
                    onSearchChange={setSearchTerm}
                    onSpeakerChange={setSelectedSpeaker}
                    onSeriesChange={setSelectedSeries}
                    onTagsChange={setSelectedTags}
                    onClearFilters={clearAllFilters}
                  />

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
