
import React from 'react';

interface DebugInfoProps {
  debugInfo: string | null;
}

const DebugInfo = ({ debugInfo }: DebugInfoProps) => {
  if (!debugInfo) return null;
  
  // Check if the debug info contains validation error
  const hasValidationError = debugInfo.includes('validation_error') || 
                            debugInfo.includes('Validation error') ||
                            debugInfo.includes('400');
  
  return (
    <div className={`mt-4 p-3 rounded-md ${hasValidationError ? 'bg-red-50 border border-red-200' : 'bg-gray-100'}`}>
      <h3 className={`font-bold text-sm mb-1 ${hasValidationError ? 'text-red-600' : ''}`}>
        {hasValidationError ? 'Error Information:' : 'Debug Information:'}
      </h3>
      
      {hasValidationError && (
        <div className="mb-2 text-sm text-red-600">
          <p>Resend API validation error detected (400 Bad Request). Common causes:</p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li>Malformed email address (must be valid format and under 254 characters)</li>
            <li>Empty required fields (name, email, subject)</li>
            <li>Invalid characters in content fields</li>
            <li>HTML content exceeding size limits (max 10MB for free tier)</li>
            <li>Missing "from" email (must use a verified domain or Resend's shared domains)</li>
            <li>API key permissions issues (check if your API key has sending privileges)</li>
          </ul>
        </div>
      )}
      
      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
    </div>
  );
};

export default DebugInfo;
