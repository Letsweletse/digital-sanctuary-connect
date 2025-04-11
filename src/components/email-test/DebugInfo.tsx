
import React from 'react';

interface DebugInfoProps {
  debugInfo: string | null;
}

const DebugInfo = ({ debugInfo }: DebugInfoProps) => {
  if (!debugInfo) return null;
  
  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-md">
      <h3 className="font-bold text-sm mb-1">Debug Information:</h3>
      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
    </div>
  );
};

export default DebugInfo;
