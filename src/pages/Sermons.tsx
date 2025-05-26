
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useSermons } from '@/hooks/useSermons';
import { useSermonFilters } from '@/hooks/useSermonFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
          {/* Main Update Notice */}
          <Card className="mx-auto max-w-4xl bg-amber-50 border-amber-200 shadow-lg">
            <CardContent className="text-center py-16">
              <Settings className="h-16 w-16 text-amber-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-amber-800 mb-6">
                Sermons Page Update in Progress
              </h1>
              <div className="max-w-2xl mx-auto">
                <p className="text-xl text-amber-700 mb-4">
                  We're currently updating our sermons page to provide you with a better experience.
                </p>
                <p className="text-lg text-amber-600">
                  We apologize for any inconvenience and appreciate your patience. 
                  Please check back soon for our complete sermon library.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
