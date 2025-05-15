
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SermonSeriesProps {
  series: string;
  setSeries: (series: string) => void;
}

const SermonSeries = ({ series, setSeries }: SermonSeriesProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
          Sermon Series (Optional)
        </Label>
        <Input
          type="text"
          id="series"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-blue"
          placeholder="e.g. Perspectives on the Apostolic"
        />
      </div>
    </div>
  );
};

export default SermonSeries;
