
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Subscriber } from '@/types/subscriberTypes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, X, FileText, Upload } from 'lucide-react';

interface SubscriberImportProps {
  onImport: (subscribers: Omit<Subscriber, 'id'>[]) => void;
  onCancel: () => void;
}

const SubscriberImport = ({ onImport, onCancel }: SubscriberImportProps) => {
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<{
    success: boolean;
    subscribers: Omit<Subscriber, 'id'>[];
    errors: string[];
  } | null>(null);
  
  const handleParse = () => {
    setIsParsing(true);
    setParseResult(null);
    
    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain a header row and at least one data row');
      }
      
      // Parse header row
      const header = lines[0].split(',').map(h => h.trim());
      const requiredFields = ['email'];
      
      // Check for required fields
      for (const field of requiredFields) {
        if (!header.includes(field)) {
          throw new Error(`CSV must contain required field: ${field}`);
        }
      }
      
      // Parse data rows
      const subscribers: Omit<Subscriber, 'id'>[] = [];
      const errors: string[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',').map(v => v.trim());
        if (values.length !== header.length) {
          errors.push(`Line ${i+1}: Expected ${header.length} values, got ${values.length}`);
          continue;
        }
        
        const subscriberData: Record<string, any> = {};
        for (let j = 0; j < header.length; j++) {
          const field = header[j];
          const value = values[j];
          
          if (field === 'email' && !value) {
            errors.push(`Line ${i+1}: Email is required`);
            continue;
          }
          
          // Handle special fields
          if (field === 'groups') {
            subscriberData[field] = value ? value.split(';') : [];
          } else if (field === 'unsubscribed') {
            subscriberData[field] = value.toLowerCase() === 'true';
          } else if (field === 'subscribeDate' || field === 'lastContactDate') {
            subscriberData[field] = value ? new Date(value) : (field === 'subscribeDate' ? new Date() : null);
          } else {
            subscriberData[field] = value;
          }
        }
        
        // Ensure required fields are present
        if (!subscriberData.source) {
          subscriberData.source = 'CSV Import';
        }
        if (!subscriberData.subscribeDate) {
          subscriberData.subscribeDate = new Date();
        }
        
        subscribers.push(subscriberData as Omit<Subscriber, 'id'>);
      }
      
      setParseResult({
        success: errors.length === 0,
        subscribers,
        errors
      });
      
    } catch (error: any) {
      setParseResult({
        success: false,
        subscribers: [],
        errors: [error.message || 'Failed to parse CSV']
      });
    } finally {
      setIsParsing(false);
    }
  };
  
  const handleImport = () => {
    if (!parseResult?.subscribers.length) {
      toast({
        title: "Error",
        description: "No valid subscribers to import.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      onImport(parseResult.subscribers);
      onCancel();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import subscribers.",
        variant: "destructive",
      });
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="glass-panel bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-church-neutral-900">
          Import Subscribers
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {!parseResult && (
        <>
          <div className="bg-church-neutral-50 border border-church-neutral-200 rounded-lg p-5 mb-6">
            <h4 className="font-medium text-church-neutral-800 mb-2">CSV Format</h4>
            <p className="text-church-neutral-600 mb-4">
              Your CSV file should have the following format:
            </p>
            <div className="bg-white p-3 rounded border border-church-neutral-200 overflow-x-auto">
              <pre className="text-xs">email,firstName,lastName,source,subscribeDate,unsubscribed,groups</pre>
              <pre className="text-xs">john@example.com,John,Doe,Website,2025-05-01,false,"Newsletter;Events"</pre>
            </div>
            <p className="text-church-neutral-500 text-sm mt-3">
              <strong>Required fields:</strong> email<br />
              <strong>Optional fields:</strong> firstName, lastName, source, subscribeDate, unsubscribed, groups (semicolon separated)
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-church-neutral-700 mb-2">
                Upload CSV File
              </label>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <label>
                    <FileText className="w-4 h-4" />
                    <span>Choose File</span>
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </Button>
                <p className="text-church-neutral-500 my-auto text-sm">
                  {csvContent ? "File selected" : "No file selected"}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-church-neutral-700">
                Or Paste CSV Content
              </label>
              <Textarea
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="email,firstName,lastName,source,subscribeDate,unsubscribed,groups"
                className="h-40"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <Button 
                onClick={handleParse} 
                disabled={!csvContent.trim() || isParsing}
                className="flex items-center gap-2"
              >
                {isParsing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Parsing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Parse CSV</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
      
      {parseResult && (
        <div className="space-y-6">
          {parseResult.success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Successfully parsed {parseResult.subscribers.length} subscriber{parseResult.subscribers.length !== 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {parseResult.errors.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {parseResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  'Failed to parse CSV.'
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {parseResult.subscribers.length > 0 && (
            <>
              <div>
                <h4 className="font-medium text-church-neutral-700 mb-2">Preview</h4>
                <div className="border border-church-neutral-200 rounded-md overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-church-neutral-100">
                        <th className="p-2 text-left text-church-neutral-700 font-medium">Email</th>
                        <th className="p-2 text-left text-church-neutral-700 font-medium">Name</th>
                        <th className="p-2 text-left text-church-neutral-700 font-medium">Source</th>
                        <th className="p-2 text-left text-church-neutral-700 font-medium">Groups</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.subscribers.slice(0, 5).map((subscriber, index) => (
                        <tr key={index} className="border-t border-church-neutral-200">
                          <td className="p-2 text-church-neutral-800">{subscriber.email}</td>
                          <td className="p-2 text-church-neutral-800">
                            {subscriber.firstName && subscriber.lastName 
                              ? `${subscriber.firstName} ${subscriber.lastName}`
                              : subscriber.firstName || subscriber.lastName || "—"}
                          </td>
                          <td className="p-2 text-church-neutral-700">{subscriber.source}</td>
                          <td className="p-2 text-church-neutral-700">
                            {subscriber.groups && subscriber.groups.length > 0
                              ? subscriber.groups.join(', ')
                              : "—"}
                          </td>
                        </tr>
                      ))}
                      {parseResult.subscribers.length > 5 && (
                        <tr className="border-t border-church-neutral-200">
                          <td colSpan={4} className="p-2 text-center text-church-neutral-500 italic">
                            And {parseResult.subscribers.length - 5} more...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => {
                  setParseResult(null);
                }}>
                  Back
                </Button>
                <Button 
                  onClick={handleImport}
                  className="flex items-center gap-2"
                  disabled={parseResult.subscribers.length === 0}
                >
                  <Upload className="w-4 h-4" />
                  <span>Import {parseResult.subscribers.length} Subscriber{parseResult.subscribers.length !== 1 ? 's' : ''}</span>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriberImport;
