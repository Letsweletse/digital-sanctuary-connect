
import React from 'react';
import { DatabaseIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DatabaseStatusProps {
  isUsingMockData: boolean;
  refreshData: () => void;
  isLoading: boolean;
}

const DatabaseStatus = ({ isUsingMockData, refreshData, isLoading }: DatabaseStatusProps) => {
  return (
    <div className="mb-4">
      <Alert className={isUsingMockData ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUsingMockData ? (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            
            <AlertDescription className={isUsingMockData ? "text-yellow-700" : "text-green-700"}>
              <span className="flex items-center gap-2">
                <DatabaseIcon className="h-4 w-4" />
                {isUsingMockData 
                  ? "Using mock data from localStorage. No Supabase connection available."
                  : "Connected to Supabase. Showing real registration data."}
              </span>
            </AlertDescription>
          </div>
          
          {!isUsingMockData && (
            <Button
              size="sm"
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
              className="text-xs"
            >
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default DatabaseStatus;
