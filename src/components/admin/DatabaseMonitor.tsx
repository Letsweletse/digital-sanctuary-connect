
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDualSermons } from '@/hooks/useDualSermons';
import { RefreshCw, Database, Server, Activity } from 'lucide-react';

const DatabaseMonitor = () => {
  const {
    sermons,
    loading,
    error,
    activeProvider,
    switchProvider,
    refreshSermons
  } = useDualSermons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-church-neutral-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-church-blue" />
          Database Monitor
        </h2>
        <Button 
          onClick={refreshSermons} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Active Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={activeProvider === 'supabase' ? 'default' : 'secondary'}>
                {activeProvider}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sermons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sermons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={error ? 'destructive' : 'default'}>
              {loading ? 'Connecting...' : error ? 'Error' : 'Connected'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Provider Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Database Provider Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => switchProvider('supabase')}
              variant={activeProvider === 'supabase' ? 'default' : 'outline'}
              size="sm"
            >
              Use Supabase
            </Button>
            <Button
              onClick={() => switchProvider('mongodb')}
              variant={activeProvider === 'mongodb' ? 'default' : 'outline'}
              size="sm"
            >
              Use MongoDB
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Switch between database providers. The system will automatically fall back to the alternate provider if the primary one fails.
          </p>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Database Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Sermons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sermons</CardTitle>
        </CardHeader>
        <CardContent>
          {sermons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No sermons found in the database.
            </p>
          ) : (
            <div className="space-y-2">
              {sermons.slice(0, 5).map((sermon) => (
                <div key={sermon.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{sermon.title}</p>
                    <p className="text-sm text-gray-600">
                      {sermon.speaker} • {sermon.date instanceof Date ? sermon.date.toLocaleDateString() : new Date(sermon.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {sermon.audioUrl && (
                      <Badge variant="secondary" className="text-xs">Audio</Badge>
                    )}
                    {sermon.youtubeId && (
                      <Badge variant="secondary" className="text-xs">Video</Badge>
                    )}
                    {sermon.featured && (
                      <Badge variant="default" className="text-xs">Featured</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseMonitor;
