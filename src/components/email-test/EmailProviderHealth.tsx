
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCw, CheckCircle, XCircle, Shield } from 'lucide-react';

interface EmailProviderHealthProps {
  providerHealth: {
    checking: boolean;
    primary: {
      available: boolean;
      message?: string;
    };
    fallback: {
      available: boolean;
      message?: string;
    };
    lastChecked?: Date;
  };
  onRefresh: () => void;
  useRedundancySystem: boolean;
  setUseRedundancySystem: (value: boolean) => void;
}

const EmailProviderHealth = ({
  providerHealth,
  onRefresh,
  useRedundancySystem,
  setUseRedundancySystem
}: EmailProviderHealthProps) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Email Providers Status</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onRefresh}
          disabled={providerHealth.checking}
          className="h-8 px-2"
        >
          {providerHealth.checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Primary (Resend):</span>
            {providerHealth.checking ? (
              <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
            ) : providerHealth.primary.available ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className="text-xs text-gray-500">
            {providerHealth.primary.message || 'Not checked'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Fallback (SendGrid):</span>
            {providerHealth.checking ? (
              <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
            ) : providerHealth.fallback.available ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
          </div>
          <span className="text-xs text-gray-500">
            {providerHealth.fallback.message || 'Not checked'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium">Redundancy System:</span>
          </div>
          <Switch
            checked={useRedundancySystem}
            onCheckedChange={setUseRedundancySystem}
            aria-label="Toggle redundancy system"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          When enabled, emails will automatically failover to the backup provider if the primary one fails
        </p>
      </div>
      
      {providerHealth.lastChecked && (
        <div className="mt-1 text-xs text-gray-500">
          Last checked: {providerHealth.lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default EmailProviderHealth;
