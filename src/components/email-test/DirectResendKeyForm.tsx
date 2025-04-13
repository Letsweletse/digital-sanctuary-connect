
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getStoredResendApiKey, storeResendApiKey, clearStoredResendApiKey } from '@/lib/directResendService';
import { toast } from 'sonner';
import { Key, Save, ShieldAlert, X } from 'lucide-react';
import { invokeEmailFunction } from './services/edgeFunctionService';

const DirectResendKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Load stored API key on component mount
  useEffect(() => {
    const storedKey = getStoredResendApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.trim().length < 10) {
      toast.error('Invalid API Key', {
        description: 'Please enter a valid Resend API key'
      });
      return;
    }
    
    storeResendApiKey(apiKey);
    setIsStored(true);
    
    toast.success('API Key Saved', {
      description: 'Your Resend API key has been saved for direct sending'
    });
  };
  
  const handleClearApiKey = () => {
    clearStoredResendApiKey();
    setApiKey('');
    setIsStored(false);
    
    toast.info('API Key Removed', {
      description: 'Your Resend API key has been removed'
    });
  };
  
  const handleTestDirectKey = async () => {
    if (!apiKey) {
      toast.error('API Key Required', {
        description: 'Please enter a Resend API key to test'
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      // First try to check using the edge function
      const result = await invokeEmailFunction('check-resend-status', {
        externalApiKey: apiKey,
        checkType: 'direct-key-test',
        timestamp: Date.now()
      });
      
      console.log('Direct key test result:', result);
      
      if (result.success && result.data?.success) {
        toast.success('API Key Valid', {
          description: 'Your Resend API key is valid and working correctly'
        });
      } else {
        toast.error('API Key Issue', {
          description: result.data?.message || 'There was a problem with your Resend API key'
        });
      }
    } catch (error) {
      console.error('Error testing direct key:', error);
      toast.error('Test Failed', {
        description: error instanceof Error ? error.message : 'Failed to test API key'
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card className="p-4 mb-4 border-red-100 bg-red-50">
      <div className="flex items-center mb-2">
        <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
        <h3 className="text-md font-semibold text-red-700">Direct Resend API Access</h3>
      </div>
      
      <p className="text-sm text-red-700 mb-3">
        If Supabase Edge Functions are causing issues, you can configure direct Resend API access as a fallback.
      </p>
      
      <div className="space-y-2">
        <div>
          <Label htmlFor="resend-api-key" className="text-sm font-medium">
            Resend API Key
          </Label>
          <div className="relative">
            <Input
              id="resend-api-key"
              type={isVisible ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="re_1234..."
              className="pr-10"
            />
            <button 
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This key will be stored locally in your browser for direct API access when needed.
          </p>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveApiKey}
            className="flex-1 border-red-200 bg-white hover:bg-red-100"
            disabled={!apiKey}
          >
            <Save className="h-4 w-4 mr-1" />
            {isStored ? "Update Key" : "Save Key"}
          </Button>
          
          {isStored && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearApiKey}
              className="border-red-200 bg-white hover:bg-red-100"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Key
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTestDirectKey}
            className="border-red-200 bg-white hover:bg-red-100"
            disabled={!apiKey || isTesting}
          >
            <Key className="h-4 w-4 mr-1" />
            Test Key
          </Button>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-600">
        <p>
          <span className="font-semibold">Note:</span> Get your API key from{' '}
          <a 
            href="https://resend.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Resend API Keys
          </a> page.
        </p>
      </div>
    </Card>
  );
};

export default DirectResendKeyForm;
