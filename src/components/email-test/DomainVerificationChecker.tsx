
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { invokeEmailFunction } from './services/edgeFunctionService';
import { toast } from 'sonner';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const DomainVerificationChecker = () => {
  const [domainStatus, setDomainStatus] = useState<{
    checking: boolean;
    verified: boolean | null;
    domains: any[] | null;
    message: string | null;
  }>({
    checking: false,
    verified: null,
    domains: null,
    message: null
  });
  
  const checkDomainVerification = async () => {
    setDomainStatus(prev => ({
      ...prev,
      checking: true,
      message: "Checking domain verification status..."
    }));
    
    try {
      const result = await invokeEmailFunction('send-email', {
        requestType: 'domain-check',
        timestamp: Date.now()
      });
      
      console.log('Domain verification check result:', result);
      
      if (result.success && result.data) {
        const domainsData = result.data.domains || [];
        const hasVerifiedDomains = domainsData.some((domain: any) => domain.status === 'verified');
        
        setDomainStatus({
          checking: false,
          verified: hasVerifiedDomains,
          domains: domainsData,
          message: hasVerifiedDomains 
            ? "Domain verification confirmed" 
            : "No verified domains found"
        });
        
        if (hasVerifiedDomains) {
          toast.success('Domain Verification Confirmed', {
            description: `You have ${domainsData.filter((d: any) => d.status === 'verified').length} verified domain(s) ready for sending.`
          });
        } else {
          toast.warning('Domain Verification Required', {
            description: 'You need to verify a domain in Resend to send emails from your own domain.',
            action: {
              label: 'Learn More',
              onClick: () => window.open('https://resend.com/domains', '_blank')
            }
          });
        }
      } else {
        setDomainStatus({
          checking: false,
          verified: false,
          domains: null,
          message: result.error || "Failed to check domain verification"
        });
        
        toast.error('Domain Check Failed', {
          description: result.error || "Could not verify domain status"
        });
      }
    } catch (error) {
      console.error('Error checking domain verification:', error);
      
      setDomainStatus({
        checking: false,
        verified: false,
        domains: null,
        message: error instanceof Error ? error.message : "Unexpected error checking domains"
      });
      
      toast.error('Domain Check Error', {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };
  
  // Check domain verification on component mount
  useEffect(() => {
    checkDomainVerification();
  }, []);
  
  if (domainStatus.verified === null && !domainStatus.checking) {
    return null;
  }
  
  return (
    <div className="mt-4 p-3 rounded-md border bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {domainStatus.verified ? (
            <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          )}
          <h3 className="text-sm font-medium">Domain Verification</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={checkDomainVerification}
          disabled={domainStatus.checking}
          className="h-7 text-xs"
        >
          {domainStatus.checking ? "Checking..." : "Check Again"}
        </Button>
      </div>
      
      <div className="text-sm">
        {domainStatus.checking ? (
          <p className="text-gray-500">Checking domain verification status...</p>
        ) : domainStatus.verified ? (
          <div>
            <p className="text-green-600 font-medium">✓ Domain verified and ready to send</p>
            {domainStatus.domains && domainStatus.domains.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                <p>Verified domains:</p>
                <ul className="list-disc ml-5">
                  {domainStatus.domains
                    .filter((d: any) => d.status === 'verified')
                    .map((domain: any, index: number) => (
                      <li key={index}>{domain.name}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-amber-600">Domain verification required</p>
            <p className="text-xs text-gray-600 mt-1">
              You need to verify a domain in Resend to send emails from your own domain. 
              <a 
                href="https://resend.com/domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 ml-1 hover:underline"
              >
                Verify a domain
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainVerificationChecker;
