
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
      
      // First check if the current API key is valid
      const keyCheckResponse = await supabase.functions.invoke('check-resend-status', {
        body: { timestamp: Date.now() }
      });
      
      console.log("API key check response:", keyCheckResponse);
      
      if (keyCheckResponse.error) {
        throw new Error(`Error checking API key: ${keyCheckResponse.error.message}`);
      }
      
      // Now check domain verification specifically
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
          ? "Domain is verified ✓" 
          : "Domain verification required ✗",
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
  
  // Check all API keys to see which one is valid and has domain issues
  const checkAllApiKeys = async () => {
    setChecking(true);
    
    try {
      console.log("Checking all API keys...");
      
      const { data, error } = await supabase.functions.invoke('check-resend-status', {
        body: { 
          checkHistory: true,
          timestamp: Date.now()
        }
      });
      
      if (error) {
        throw new Error(`Error checking API keys: ${error.message}`);
      }
      
      console.log("API key history check response:", data);
      
      // We have the results, now find any key with domain verification issues
      const keyWithDomainIssue = data.keyResults?.find(key => 
        key.isValid && !key.domainVerified && key.message?.includes("domain")
      );
      
      if (keyWithDomainIssue) {
        setStatus({
          checked: true,
          verified: false,
          domain: "gategaborone.com",
          message: `Found key with domain verification issue: ${keyWithDomainIssue.key}`,
          error: keyWithDomainIssue.message,
          apiKey: keyWithDomainIssue.key
        });
      } else {
        // Check if we have a valid key at all
        const validKey = data.keyResults?.find(key => key.isValid);
        
        if (validKey) {
          setStatus({
            checked: true,
            verified: validKey.domainVerified,
            domain: "gategaborone.com",
            message: validKey.domainVerified 
              ? `Found valid key with verified domain: ${validKey.key}` 
              : `Found valid key but domain may need verification: ${validKey.key}`,
            apiKey: validKey.key
          });
        } else {
          setStatus({
            checked: true,
            verified: false,
            domain: "gategaborone.com",
            message: "No valid API keys found",
            error: "All keys appear to be invalid"
          });
        }
      }
    } catch (err) {
      console.error("Error checking API keys:", err);
      setStatus({
        checked: true,
        verified: false,
        domain: "gategaborone.com",
        message: "Error checking API keys",
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
        <div className="space-x-2">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkAllApiKeys} 
            disabled={checking}
            className="text-xs"
          >
            {checking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Check All Keys
          </Button>
        </div>
      </div>
      
      {status.checked && (
        <div className="bg-gray-50 p-4 rounded-md">
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
            {status.apiKey && (
              <div className="text-sm text-gray-500">
                API Key: {status.apiKey}
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <span className={`text-sm ${status.verified ? 'text-green-600' : 'text-amber-600'}`}>
              {status.message}
            </span>
          </div>
          
          {!status.verified && (
            <Alert className={status.error ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}>
              <div className="flex flex-col space-y-2">
                <AlertDescription>
                  <p className="font-medium mb-1">Domain verification is required before sending emails</p>
                  {status.error && (
                    <p className="text-sm text-amber-700 mb-2">{status.error}</p>
                  )}
                  <p className="text-sm">To verify the domain:</p>
                  <ol className="list-decimal list-inside text-sm space-y-1 mt-1">
                    <li>Go to <a href="https://resend.com/domains" className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                      Resend Domains Page <ExternalLink className="h-3 w-3 ml-1" />
                    </a></li>
                    <li>Add and verify your domain (gategaborone.com)</li>
                    <li>Follow the DNS configuration instructions provided by Resend</li>
                    <li>Wait for verification to complete (can take up to 24-48 hours)</li>
                  </ol>
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainVerificationChecker;
