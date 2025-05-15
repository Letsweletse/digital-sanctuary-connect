
import React from 'react';

interface SermonHeaderProps {
  totalSermons: number;
}

const SermonHeader = ({ totalSermons }: SermonHeaderProps) => {
  return (
    <div className="max-w-4xl mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-3">
        Sermon Library
      </h1>
      <p className="text-church-neutral-600 mb-4 max-w-3xl">
        Listen to and download sermons that bring biblical truth to life. 
        Browse by speaker, topic, or scripture reference.
      </p>
      <div className="text-sm text-church-neutral-500">
        Our library contains {totalSermons} sermon{totalSermons !== 1 ? 's' : ''} for your spiritual growth.
      </div>
    </div>
  );
};

export default SermonHeader;
