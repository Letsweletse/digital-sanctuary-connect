
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const DomainVerificationChecker = () => {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{
    checked: boolean;
    verified: boolean;
    domain: string;
    message: string;
    error?: string;
    apiKey?: string;
  }>({
    checked: false,
    verified: false,
    domain: "gategaborone.com",
    message: "Domain verification status not checked"
  });

  const checkDomainVerification = async () => {
    setChecking(true);
    
    try {
      console.log("Checking domain verification status...");
      
      // Check domain verification specifically
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { 
          requestType: 'domain-check',
          timestamp: Date.now()
        }
      });
      
      if (error) {
        throw new Error(`Error checking domain: ${error.message}`);
      }
      
      console.log("Domain verification check response:", data);
      
      setStatus({
        checked: true,
        verified: data.verified || false,
        domain: data.domain || "gategaborone.com",
        message: data.verified 
          ? "Domain is fully verified ✓" 
          : "Domain verification may require attention ✗",
        error: data.error,
        apiKey: data.apiKey
      });
    } catch (err) {
      console.error("Error checking domain verification:", err);
      setStatus({
        checked: true,
        verified: false,
        domain: "gategaborone.com",
        message: "Error checking domain verification",
        error: err instanceof Error ? err.message : "Unknown error"
      });
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium">Domain Verification Status</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkDomainVerification} 
          disabled={checking}
          className="text-xs"
        >
          {checking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Check Domain
        </Button>
      </div>
      
      {status.checked && (
        <div className="bg-gray-50 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Domain:</span>
              <span>{status.domain}</span>
              {status.verified ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <span className={`text-sm ${status.verified ? 'text-green-600' : 'text-amber-600'}`}>
              {status.message}
            </span>
          </div>
          
          {status.apiKey && (
            <div className="text-xs text-gray-500 mt-2">
              API Key: {status.apiKey.substring(0, 10)}...
            </div>
          )}
          
          {!status.verified && status.error && (
            <Alert variant="destructive" className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {status.error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <p>Domain Verification Details:</p>
        <ul className="list-disc ml-4">
          <li>Region: sa-east-1 (São Paulo)</li>
          <li>DNS Records: DKIM, SPF, and DMARC configured</li>
          <li>Created: 8 days ago</li>
        </ul>
      </div>
    </div>
  );
};

export default DomainVerificationChecker;
