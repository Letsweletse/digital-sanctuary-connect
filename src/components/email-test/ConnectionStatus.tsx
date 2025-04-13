
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import { Loader2, WifiOff, Wifi, AlertTriangle } from 'lucide-react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState<{
    checking: boolean;
    connected: boolean;
    edgeFunctionsConnected?: boolean;
    error?: string;
    lastChecked?: Date;
  }>({
    checking: true,
    connected: false
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const connectionStatus = await checkSupabaseConnection();
      console.log("Connection check result:", connectionStatus);
      
      setStatus({
        checking: false,
        connected: connectionStatus.connected,
        edgeFunctionsConnected: connectionStatus.edgeFunctionsConnected,
        error: connectionStatus.error,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error("Error checking connection:", error);
      setStatus({
        checking: false,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Set up a periodic check every 60 seconds
    const interval = setInterval(() => {
      checkConnection();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Connection Status</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={checkConnection}
          disabled={status.checking}
          className="h-8 px-2"
        >
          {status.checking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-xs">Refresh</span>
          )}
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium">Supabase:</span>
          {status.checking ? (
            <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
          ) : status.connected ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium">Edge Functions:</span>
          {status.checking ? (
            <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
          ) : status.edgeFunctionsConnected ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
      
      {status.error && (
        <div className="mt-2 text-xs text-red-600 flex items-start space-x-1">
          <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>{status.error}</span>
        </div>
      )}
      
      {status.lastChecked && (
        <div className="mt-1 text-xs text-gray-500">
          Last checked: {status.lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
