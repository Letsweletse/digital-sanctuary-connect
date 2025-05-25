
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, AlertCircle } from 'lucide-react';
import { DatabaseProvider } from '@/services/dualSermonService';

interface DatabaseSwitcherProps {
  activeProvider: DatabaseProvider;
  onSwitchProvider: (provider: DatabaseProvider) => void;
  onRefresh: () => void;
  sermonCount: number;
  loading?: boolean;
}

const DatabaseSwitcher = ({ 
  activeProvider, 
  onSwitchProvider, 
  onRefresh, 
  sermonCount,
  loading = false 
}: DatabaseSwitcherProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-church-blue" />
          Database Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Active Provider:</span>
              <Badge variant={activeProvider === 'supabase' ? 'default' : 'secondary'}>
                {activeProvider === 'supabase' ? 'Supabase' : 'MongoDB'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-church-neutral-600">
              <AlertCircle className="h-4 w-4" />
              <span>{sermonCount} sermons loaded</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchProvider('supabase')}
              disabled={loading || activeProvider === 'supabase'}
            >
              Use Supabase
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchProvider('mongodb')}
              disabled={loading || activeProvider === 'mongodb'}
            >
              Use MongoDB
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSwitcher;
