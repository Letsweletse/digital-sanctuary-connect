
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useSermons } from '@/hooks/useSermons';
import { getSermonsBySeries } from '@/utils/sermonFilterUtils';
import { Sermon } from '@/types/sermonTypes';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import SermonGridView from '@/components/sermons/SermonGridView';
import { Card } from '@/components/ui/card';

const SermonSeries = () => {
  const { seriesName } = useParams<{ seriesName: string }>();
  const { sermons, isLoading, error } = useSermons();
  const [seriesSermons, setSeriesSermons] = useState<Sermon[]>([]);
  
  useEffect(() => {
    if (sermons && seriesName) {
      const decodedSeriesName = decodeURIComponent(seriesName);
      const filtered = getSermonsBySeries(sermons, decodedSeriesName);
      setSeriesSermons(filtered);
    }
  }, [sermons, seriesName]);

  const decodedSeriesName = seriesName ? decodeURIComponent(seriesName) : '';

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-10">
            <div className="w-10 h-10 border-2 border-church-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-church-neutral-600">Loading series...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <Card className="mx-auto max-w-2xl bg-red-50 border-red-200">
            <div className="text-center py-10">
              <p className="text-red-600 mb-2">Error: {error}</p>
              <p className="text-church-neutral-500 text-sm">Please try refreshing the page.</p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Button variant="ghost" asChild className="flex items-center mb-4 text-church-blue">
            <Link to="/sermons" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to All Sermons
            </Link>
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-2">
            {decodedSeriesName}
          </h1>
          
          <p className="text-church-neutral-600 mb-4">
            {seriesSermons.length} {seriesSermons.length === 1 ? 'sermon' : 'sermons'} in this series
          </p>
        </div>
        
        {seriesSermons.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-church-neutral-200 p-4 md:p-6">
            <SermonGridView sermons={seriesSermons} />
          </div>
        ) : (
          <Card className="mx-auto max-w-2xl bg-church-neutral-50">
            <div className="text-center py-10">
              <p className="text-church-neutral-600 mb-4">No sermons found in this series.</p>
              <Link to="/sermons" className="text-church-blue hover:underline">
                Back to all sermons
              </Link>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SermonSeries;
