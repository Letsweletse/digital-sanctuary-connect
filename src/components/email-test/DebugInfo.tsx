
import React from 'react';

interface DebugInfoProps {
  debugInfo: string | null;
}

const DebugInfo = ({ debugInfo }: DebugInfoProps) => {
  if (!debugInfo) return null;
  
  // Check if the debug info contains validation error
  const hasValidationError = debugInfo.includes('validation_error');
  
  return (
    <div className={`mt-4 p-3 rounded-md ${hasValidationError ? 'bg-red-50 border border-red-200' : 'bg-gray-100'}`}>
      <h3 className={`font-bold text-sm mb-1 ${hasValidationError ? 'text-red-600' : ''}`}>
        {hasValidationError ? 'Error Information:' : 'Debug Information:'}
      </h3>
      
      {hasValidationError && (
        <div className="mb-2 text-sm text-red-600">
          <p>Resend API validation error detected. Common causes:</p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li>Malformed email address</li>
            <li>Empty required fields (name, email)</li>
            <li>Invalid characters in recipient fields</li>
            <li>API key or permissions issues</li>
          </ul>
        </div>
      )}
      
      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
    </div>
  );
};

export default DebugInfo;
