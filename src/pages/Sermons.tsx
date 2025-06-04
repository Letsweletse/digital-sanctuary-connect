
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useDualSermons } from '@/hooks/useDualSermons';
import { useLatestSermon } from '@/hooks/useLatestSermon';
import SermonHeader from '@/components/sermons/SermonHeader';
import FilterBar from '@/components/sermons/FilterBar';
import ViewSelector from '@/components/sermons/ViewSelector';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertTriangle, Settings, Heart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sermons = () => {
  const navigate = useNavigate();
  const { sermons, loading, error, refreshSermons } = useDualSermons();
  const { latestSermon, isAdding } = useLatestSermon();
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

  // Force refresh when component mounts
  React.useEffect(() => {
    console.log('Sermons page mounted, forcing refresh');
    setTimeout(() => {
      refreshSermons();
    }, 100);
  }, []);

  if (loading || isAdding) {
    return (
      <Layout>
        <main className="flex-grow py-10 md:py-16 bg-church-neutral-50 page-transition">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-4xl">
              <CardContent className="text-center py-16">
                <Loader2 className="h-16 w-16 text-church-blue mx-auto mb-6 animate-spin" />
                <h1 className="text-2xl font-bold text-church-neutral-800 mb-4">
                  {isAdding ? 'Adding Latest Sermon...' : 'Loading Sermons...'}
                </h1>
                <p className="text-church-neutral-600">
                  {isAdding 
                    ? 'Please wait while we add the latest sermon to our database.'
                    : 'Connecting to database and loading sermons...'
                  }
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
                <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-red-800 mb-4">
                  Database Connection Error
                </h1>
                <p className="text-red-700 mb-4">
                  We're experiencing difficulty connecting to our sermon database.
                </p>
                <p className="text-red-600 text-sm mb-6 bg-red-100 p-3 rounded">
                  Error: {error}
                </p>
                <div className="space-y-3">
                  <Button onClick={refreshSermons} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry Connection
                  </Button>
                  <p className="text-sm text-red-600">
                    If the problem persists, please contact support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </Layout>
    );
  }

  // Show coming soon message if no sermons are available
  if (sermons.length === 0) {
    return (
      <Layout>
        <main className="flex-grow py-10 md:py-16 bg-gradient-to-br from-slate-50 to-blue-50 page-transition">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="text-center py-16 px-8">
                  {/* Header Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Settings className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  
                  {/* Main Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                    🛠️ Sermons Coming Soon
                  </h1>
                  
                  {/* Description */}
                  <div className="max-w-2xl mx-auto mb-8 space-y-4">
                    <p className="text-lg text-slate-600 leading-relaxed">
                      We're currently updating our sermons backend to bring you a better experience. 
                      Please bear with us—new audio and video sermons will be available here shortly.
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Thank you for your patience and continued support.</span>
                    </div>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-slate-800">
                        Don't miss our upcoming events!
                      </h3>
                    </div>
                    <p className="text-slate-600 mb-4">
                      Spots are filling up fast—visit the Events page and secure your place today.
                    </p>
                    <Button 
                      onClick={() => navigate('/events')}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      View Events
                    </Button>
                  </div>
                  
                  {/* Refresh Option */}
                  <Button 
                    onClick={refreshSermons} 
                    variant="outline" 
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 px-6 py-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Again
                  </Button>
                </CardContent>
              </Card>
            </div>
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
