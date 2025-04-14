
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getStoredResendApiKey, storeResendApiKey, clearStoredResendApiKey } from '@/lib/directResendService';
import { toast } from 'sonner';
import { Key, Save, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { invokeEmailFunction } from './services/edgeFunctionService';

const DirectResendKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load stored API key on component mount and verify storage
  useEffect(() => {
    const loadStoredKey = () => {
      try {
        setIsLoading(true);
        const storedKey = getStoredResendApiKey();
        
        if (storedKey) {
          setApiKey(storedKey);
          setIsStored(true);
          console.log('✅ API key loaded from storage successfully');
        } else {
          console.log('⚠️ No API key found in storage');
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredKey();
    
    // Setup periodic check for API key persistence
    const intervalId = setInterval(() => {
      const currentKey = getStoredResendApiKey();
      if (isStored && !currentKey) {
        console.warn('⚠️ API key disappeared from storage, attempting to restore');
        if (apiKey) {
          storeResendApiKey(apiKey);
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [apiKey, isStored]);
  
  const handleSaveApiKey = () => {
    if (!apiKey || apiKey.trim().length < 10) {
      toast.error('Invalid API Key', {
        description: 'Please enter a valid Resend API key'
      });
      return;
    }
    
    // Store with our improved multi-storage method
    storeResendApiKey(apiKey);
    setIsStored(true);
    
    // Double-check storage was successful
    setTimeout(() => {
      const storedKey = getStoredResendApiKey();
      if (storedKey) {
        toast.success('API Key Saved Permanently', {
          description: 'Your Resend API key has been saved for direct sending'
        });
      } else {
        toast.error('Storage Issue Detected', {
          description: 'Your browser may be blocking permanent storage. Try a different browser.'
        });
      }
    }, 500);
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
      // First ensure the key is stored (in case they forgot to click save)
      storeResendApiKey(apiKey);
      setIsStored(true);
      
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
        Configure direct Resend API access for reliable email delivery. Your API key will be stored securely in your browser.
      </p>
      
      <div className="space-y-2">
        <div>
          <Label htmlFor="resend-api-key" className="text-sm font-medium">
            Resend API Key {isStored && <CheckCircle2 className="inline-block h-4 w-4 text-green-500 ml-1" />}
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
          {isStored && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" /> 
              API key is stored permanently in your browser
            </p>
          )}
          {!isStored && (
            <p className="text-xs text-gray-500 mt-1">
              This key will be stored permanently in your browser for direct API access.
            </p>
          )}
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveApiKey}
            className="flex-1 border-red-200 bg-white hover:bg-red-100"
            disabled={!apiKey || isLoading}
          >
            <Save className="h-4 w-4 mr-1" />
            {isStored ? "Update Key" : "Save Key Permanently"}
          </Button>
          
          {isStored && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearApiKey}
              className="border-red-200 bg-white hover:bg-red-100"
              disabled={isLoading}
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
            disabled={!apiKey || isTesting || isLoading}
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
