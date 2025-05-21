
import React, { useState, useEffect } from 'react';
import { useSubscribers } from '@/hooks/useSubscribers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubscriberEmailList = () => {
  const { 
    subscribers, 
    isLoading, 
    isUsingMockData, 
    refreshData 
  } = useSubscribers();
  
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  
  // Get all unique groups across subscribers
  const allGroups = Array.from(
    new Set(subscribers.flatMap(s => s.groups || []))
  ).sort();
  
  // Filter subscribers by selected group
  const filteredSubscribers = filterGroup 
    ? subscribers.filter(s => s.groups?.includes(filterGroup)) 
    : subscribers;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" /> 
            Registered Emails
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'} {filterGroup ? `in ${filterGroup}` : 'total'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData} 
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" /> 
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-church-blue"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                className={`cursor-pointer ${filterGroup === null ? 'bg-church-blue' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setFilterGroup(null)}
              >
                All
              </Badge>
              {allGroups.map(group => (
                <Badge 
                  key={group} 
                  className={`cursor-pointer ${filterGroup === group ? 'bg-church-blue' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setFilterGroup(group === filterGroup ? null : group)}
                >
                  {group}
                </Badge>
              ))}
            </div>
            
            <div className="border rounded-md">
              <div className="py-3 px-4 bg-muted font-medium flex">
                <div className="w-1/2">Email</div>
                <div className="w-1/4">Name</div>
                <div className="w-1/4">Source</div>
              </div>
              
              <div className="divide-y">
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map(subscriber => (
                    <div key={subscriber.id} className="py-3 px-4 flex items-center">
                      <div className="w-1/2 flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        {subscriber.email}
                      </div>
                      <div className="w-1/4 text-muted-foreground">
                        {subscriber.firstName && subscriber.lastName 
                          ? `${subscriber.firstName} ${subscriber.lastName}` 
                          : subscriber.firstName || subscriber.lastName || "—"}
                      </div>
                      <div className="w-1/4 text-muted-foreground">
                        {subscriber.source}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No subscribers found
                  </div>
                )}
              </div>
            </div>
            
            {isUsingMockData && (
              <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <strong>Note:</strong> Currently using mock data. Connect to Supabase to see actual subscriber data.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriberEmailList;
