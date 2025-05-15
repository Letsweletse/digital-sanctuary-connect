
import React from 'react';

interface SermonHeaderProps {
  totalSermons: number;
}

const SermonHeader = ({ totalSermons }: SermonHeaderProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-4 font-serif text-center">
        Sermon Library
      </h1>
      <p className="text-lg text-church-neutral-700 text-center mb-8 max-w-2xl mx-auto">
        Browse our collection of sermons that bring biblical truth to life. 
        Search by speaker, topic, or scripture reference.
      </p>
    </div>
  );
};

export default SermonHeader;
