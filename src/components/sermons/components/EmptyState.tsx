
import React from 'react';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
      <p className="text-church-neutral-600">{message}</p>
      {subMessage && (
        <p className="text-church-neutral-500 text-sm mt-2">{subMessage}</p>
      )}
    </div>
  );
};

export default EmptyState;
