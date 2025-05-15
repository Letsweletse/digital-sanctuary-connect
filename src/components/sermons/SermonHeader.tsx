
import React from 'react';

interface SermonHeaderProps {
  totalSermons: number;
}

const SermonHeader = ({ totalSermons }: SermonHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-2">
        🎧 Past Sermons
      </h2>
      <p className="text-church-neutral-600">
        Explore our collection of {totalSermons} sermons to grow in your faith journey
      </p>
    </div>
  );
};

export default SermonHeader;
