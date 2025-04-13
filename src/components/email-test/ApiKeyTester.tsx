
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Key, RefreshCw, Check, X } from 'lucide-react';

const ApiKeyTester = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    details?: any;
    testedAt?: Date;
  }>({
    status: 'idle',
    message: 'Click "Test API Key" to verify your Resend API key is working correctly.'
  });

  const testApiKey = async () => {
    setTesting(true);
    setResult({
      status: 'idle',
      message: 'Testing API key...'
    });
    
    try {
      const { data, error } = await supabase.functions.invoke('check-resend-status', {
        body: {
          checkType: 'api-key-test',
          timestamp: Date.now()
        }
      });
      
      if (error) {
        throw new Error(`Function error: ${error.message}`);
      }
      
      console.log('API key test result:', data);
      
      if (data.keyConfigured || data.success) {
        setResult({
          status: 'success',
          message: data.message || 'API key is valid and working correctly',
          details: data,
          testedAt: new Date()
        });
        
        toast.success('API Key Verified', {
          description: 'Your Resend API key is valid and working correctly'
        });
      } else {
        setResult({
          status: 'error',
          message: data.message || 'API key validation failed',
          details: data,
          testedAt: new Date()
        });
        
        toast.error('API Key Issue', {
          description: data.message || 'There was a problem with your Resend API key'
        });
      }
    } catch (error) {
      console.error('Error testing API key:', error);
      
      setResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        testedAt: new Date()
      });
      
      toast.error('API Key Test Failed', {
        description: error instanceof Error ? error.message : 'Could not complete the API key test'
      });
    } finally {
      setTesting(false);
    }
  };
  
  return (
    <Card className="p-4 mb-6 border-blue-100 bg-blue-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Key className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-md font-semibold text-blue-700">Resend API Key Verification</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={testApiKey}
          disabled={testing}
          className={`h-8 ${testing ? 'bg-blue-100' : 'bg-white hover:bg-blue-100'} border-blue-200`}
        >
          {testing ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : result.status === 'success' ? (
            <Check className="h-4 w-4 mr-1 text-green-500" />
          ) : result.status === 'error' ? (
            <X className="h-4 w-4 mr-1 text-red-500" />
          ) : (
            <></>
          )}
          {testing ? "Testing..." : "Test API Key"}
        </Button>
      </div>
      
      <div className={`rounded-md p-3 ${
        result.status === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        result.status === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        'bg-white text-gray-700 border border-gray-200'
      }`}>
        <p className="text-sm">
          {result.message}
        </p>
        
        {result.testedAt && (
          <p className="text-xs mt-1 text-gray-600">
            Last tested: {result.testedAt.toLocaleTimeString()}
          </p>
        )}
      </div>
      
      {result.status === 'error' && (
        <div className="mt-3 text-xs text-gray-600">
          <p className="font-medium">Troubleshooting steps:</p>
          <ol className="list-decimal ml-5 space-y-1 mt-1">
            <li>Verify you've entered the correct API key in Supabase secrets</li>
            <li>Ensure your Resend account is active and the API key has not expired</li>
            <li>Check that you've verified a domain in Resend for sending emails</li>
            <li>Try refreshing the API key in your Resend dashboard</li>
          </ol>
        </div>
      )}
    </Card>
  );
};

export default ApiKeyTester;
