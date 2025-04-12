
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const EmailDeliveryLogs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  
  const fetchEmailLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching email delivery logs...");
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { requestType: 'logs' }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Failed to fetch email logs: ${error.message}`);
      }
      
      console.log("Email logs response:", data);
      
      if (data?.report) {
        setReport(data.report);
      } else if (data?.logs && data.logs.length > 0) {
        // If there's logs but no formatted report, create a simple display
        const logSummary = data.logs.map((log: any) => 
          `${log.timestamp}: ${log.emailType} to ${log.recipient} - ${log.status}`
        ).join('\n');
        setReport(logSummary);
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
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
          <p className="text-xs mt-1">Check console for more details or ensure the RESEND_API_KEY is configured.</p>
        </Alert>
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
