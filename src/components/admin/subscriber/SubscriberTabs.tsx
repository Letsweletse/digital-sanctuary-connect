
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriberFilter } from '@/types/subscriberTypes';
import SubscriberList from './SubscriberList';
import { Subscriber } from '@/types/subscriberTypes';

interface SubscriberTabsProps {
  activeTab: SubscriberFilter;
  setActiveTab: (value: SubscriberFilter) => void;
  subscribers: Subscriber[];
  isLoading: boolean;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: string) => void;
  getFilteredSubscribers: (filter: SubscriberFilter) => Subscriber[];
}

const SubscriberTabs = ({
  activeTab,
  setActiveTab,
  subscribers,
  isLoading,
  onEdit,
  onDelete,
  getFilteredSubscribers
}: SubscriberTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as SubscriberFilter)}>
      <TabsList>
        <TabsTrigger value="all">All Subscribers</TabsTrigger>
        <TabsTrigger value="conference">Conference Registrants</TabsTrigger>
        <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="apostolic">Apostolic Perspective</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4">
        <SubscriberList
          subscribers={getFilteredSubscribers('all')}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
      
      <TabsContent value="conference" className="mt-4">
        <SubscriberList
          subscribers={getFilteredSubscribers('conference')}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
      
      <TabsContent value="newsletter" className="mt-4">
        <SubscriberList
          subscribers={getFilteredSubscribers('newsletter')}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
      
      <TabsContent value="events" className="mt-4">
        <SubscriberList
          subscribers={getFilteredSubscribers('events')}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
      
      <TabsContent value="apostolic" className="mt-4">
        <SubscriberList
          subscribers={getFilteredSubscribers('apostolic')}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SubscriberTabs;
