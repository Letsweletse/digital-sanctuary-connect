
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
  
  // Check if we have an API key configuration error
  const hasApiKeyError = debugInfo.includes('API key') ||
                        debugInfo.includes('RESEND_API_KEY') ||
                        debugInfo.includes('not configured');
  
  // Check if we have a delivery report
  const hasDeliveryReport = debugInfo.includes('EMAIL DELIVERY MONITORING REPORT');
  
  // Check if we have SMS notification info
  const hasSmsInfo = debugInfo.includes('smsNotificationSent') ||
                    debugInfo.includes('smsNotificationDetails');
  
  // Check for Supabase authentication issues
  const hasSupabaseAuthError = debugInfo.includes('No API key found') ||
                              debugInfo.includes('apikey request header') ||
                              debugInfo.includes('JWT') ||
                              debugInfo.includes('401') ||
                              debugInfo.includes('Supabase authentication error');
  
  return (
    <div className={`mt-4 p-3 rounded-md ${
      hasValidationError || hasApiKeyError || hasSupabaseAuthError 
        ? 'bg-red-50 border border-red-200' 
        : 'bg-gray-100'
    }`}>
      <h3 className={`font-bold text-sm mb-1 ${
        hasValidationError || hasApiKeyError || hasSupabaseAuthError 
          ? 'text-red-600' 
          : ''
      }`}>
        {hasValidationError ? 'Error Information:' : 
         hasApiKeyError ? 'API Key Configuration Error:' :
         hasSupabaseAuthError ? 'Supabase Authentication Error:' : 'Debug Information:'}
      </h3>
      
      {hasSupabaseAuthError && (
        <div className="mb-2 text-sm text-red-600">
          <p>Supabase authentication issue detected. This likely means:</p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li>Your Supabase session has expired</li>
            <li>The anon key is missing or incorrect</li>
            <li>The JWT token is invalid or missing</li>
            <li>Your browser's local storage has been cleared</li>
          </ul>
          <p className="mt-2 text-xs font-medium">Try these solutions:</p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li>Refresh the page to get a new session</li>
            <li>Check browser console for more specific errors</li>
            <li>Make sure you're using the correct Supabase URL and anon key</li>
            <li>Try signing out and signing back in (if auth is enabled)</li>
          </ul>
        </div>
      )}
      
      {hasApiKeyError && !hasSupabaseAuthError && (
        <div className="mb-2 text-sm text-red-600">
          <p>Resend API key configuration issue detected. Please check:</p>
          <ul className="list-disc pl-5 mt-1 text-xs">
            <li>The API key has been properly set in Supabase Edge Function secrets</li>
            <li>The API key format is correct (should start with 're_')</li>
            <li>The API key has not expired or been revoked</li>
            <li>Your Resend account is active and in good standing</li>
            <li>You've verified your domain in the Resend dashboard</li>
          </ul>
        </div>
      )}
      
      {hasValidationError && !hasApiKeyError && !hasSupabaseAuthError && (
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
      
      {hasDeliveryReport && (
        <div className="mb-2 text-sm text-green-600">
          <p className="font-medium">📊 Email Delivery Report Available</p>
          <p className="text-xs mt-1">The response includes detailed delivery logs and statistics</p>
        </div>
      )}
      
      {hasSmsInfo && (
        <div className="mb-2 text-sm text-blue-600">
          <p className="font-medium">📱 SMS Notification Information</p>
          <p className="text-xs mt-1">Check below for SMS delivery status</p>
        </div>
      )}
      
      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{debugInfo}</pre>
    </div>
  );
};

export default DebugInfo;
