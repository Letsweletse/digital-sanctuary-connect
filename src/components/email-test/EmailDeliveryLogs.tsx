
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const EmailDeliveryLogs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  
  const fetchEmailLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {},
        query: { logs: 'true' }
      });
      
      if (error) {
        throw new Error(`Failed to fetch email logs: ${error.message}`);
      }
      
      if (data?.report) {
        setReport(data.report);
      } else {
        setReport("No email delivery logs available yet.");
      }
    } catch (err) {
      console.error('Error fetching email logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch email logs');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium">Email Delivery Logs</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchEmailLogs} 
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Check Delivery Logs
        </Button>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 p-2 bg-red-50 rounded mb-2">
          {error}
        </div>
      )}
      
      {report && (
        <div className="bg-gray-50 p-3 rounded text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
          {report}
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Delivery logs are stored in memory and will be cleared when the edge function restarts.
      </p>
    </div>
  );
};

export default EmailDeliveryLogs;
