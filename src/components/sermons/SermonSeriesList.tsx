
import React from 'react';
import { Link } from 'react-router-dom';
import { getAllSeriesList, getSermonCountBySeries } from '@/utils/sermonFilterUtils';
import { Sermon } from '@/types/sermonTypes';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface SermonSeriesListProps {
  sermons: Sermon[];
  limit?: number;
}

const SermonSeriesList: React.FC<SermonSeriesListProps> = ({ sermons, limit }) => {
  const allSeries = getAllSeriesList(sermons);
  const seriesCount = getSermonCountBySeries(sermons);
  
  // Apply limit if specified
  const displayedSeries = limit ? allSeries.slice(0, limit) : allSeries;
  
  if (displayedSeries.length === 0) {
    return (
      <p className="text-sm text-church-neutral-500">No sermon series available.</p>
    );
  }

  return (
    <div className="space-y-2">
      {displayedSeries.map((series) => (
        <Link
          key={series}
          to={`/sermon-series/${encodeURIComponent(series)}`}
          className="flex items-center justify-between p-2 text-sm hover:bg-church-neutral-100 rounded-md group"
        >
          <div className="flex items-center gap-2">
            <span className="text-church-blue group-hover:text-church-blue-dark">{series}</span>
            <Badge variant="outline" className="bg-church-neutral-100 text-xs">
              {seriesCount[series]}
            </Badge>
          </div>
          <ChevronRight className="w-4 h-4 text-church-neutral-400 group-hover:text-church-blue" />
        </Link>
      ))}
      
      {limit && allSeries.length > limit && (
        <Link 
          to="/sermons"
          className="text-xs text-church-blue hover:text-church-blue-dark hover:underline block mt-2"
        >
          View all sermon series
        </Link>
      )}
    </div>
  );
};

export default SermonSeriesList;
