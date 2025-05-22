
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';

interface SubscriberToolbarProps {
  onAddSubscriber: () => void;
  onShowImport: () => void;
  onExport: (format: 'csv' | 'json') => void;
}

const SubscriberToolbar = ({
  onAddSubscriber,
  onShowImport,
  onExport
}: SubscriberToolbarProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-church-neutral-900">
        Email Subscribers
      </h3>
      <div className="flex gap-2">
        <Button onClick={onAddSubscriber} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Subscriber
        </Button>
        <Button onClick={onShowImport} variant="outline" className="flex items-center gap-1">
          <Upload className="w-4 h-4" /> Import
        </Button>
        <div className="relative">
          <Button 
            onClick={() => onExport('csv')} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriberToolbar;
