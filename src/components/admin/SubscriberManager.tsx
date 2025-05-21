
import React, { useState } from 'react';
import { useSubscribers } from '@/hooks/useSubscribers';
import SubscriberList from './subscriber/SubscriberList';
import SubscriberForm from './subscriber/SubscriberForm';
import SubscriberImport from './subscriber/SubscriberImport';
import { Subscriber } from '@/types/subscriberTypes';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SubscriberManager = () => {
  const {
    subscribers,
    isLoading,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    bulkImport,
    exportSubscribers
  } = useSubscribers();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [showImport, setShowImport] = useState(false);
  
  const resetState = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedSubscriber(null);
    setShowImport(false);
  };
  
  const handleAddSubscriber = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedSubscriber(null);
    setShowImport(false);
  };
  
  const handleEditSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsEditing(true);
    setIsAdding(false);
    setShowImport(false);
  };
  
  const handleDeleteSubscriber = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      deleteSubscriber(id);
    }
  };
  
  const handleSubmitSubscriber = (subscriberData: Omit<Subscriber, 'id'>) => {
    try {
      if (isEditing && selectedSubscriber) {
        updateSubscriber(selectedSubscriber.id, subscriberData);
      } else {
        addSubscriber(subscriberData);
      }
      resetState();
      return true;
    } catch (error) {
      console.error('Error submitting subscriber:', error);
      return false;
    }
  };
  
  const handleShowImport = () => {
    setShowImport(true);
    setIsAdding(false);
    setIsEditing(false);
    setSelectedSubscriber(null);
  };
  
  const handleExport = (format: 'csv' | 'json') => {
    exportSubscribers(format);
  };
  
  return (
    <div className="space-y-6">
      {(isAdding || isEditing) && (
        <SubscriberForm
          subscriber={selectedSubscriber || undefined}
          onSubmit={handleSubmitSubscriber}
          onCancel={resetState}
          isEditing={isEditing}
        />
      )}
      
      {showImport && (
        <SubscriberImport
          onImport={bulkImport}
          onCancel={resetState}
        />
      )}
      
      {!isAdding && !isEditing && !showImport && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-church-neutral-900">
              Email Subscribers
            </h3>
            <div className="flex gap-2">
              <Button onClick={handleAddSubscriber} className="flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Subscriber
              </Button>
              <Button onClick={handleShowImport} variant="outline" className="flex items-center gap-1">
                <Upload className="w-4 h-4" /> Import
              </Button>
              <div className="relative">
                <Button 
                  onClick={() => handleExport('csv')} 
                  variant="outline" 
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Subscribers</TabsTrigger>
              <TabsTrigger value="conference">Conference Registrants</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <SubscriberList
                subscribers={subscribers}
                isLoading={isLoading}
                onEdit={handleEditSubscriber}
                onDelete={handleDeleteSubscriber}
              />
            </TabsContent>
            
            <TabsContent value="conference" className="mt-4">
              <SubscriberList
                subscribers={subscribers.filter(s => s.groups?.includes('Featured Conference'))}
                isLoading={isLoading}
                onEdit={handleEditSubscriber}
                onDelete={handleDeleteSubscriber}
              />
            </TabsContent>
            
            <TabsContent value="newsletter" className="mt-4">
              <SubscriberList
                subscribers={subscribers.filter(s => s.groups?.includes('Newsletter'))}
                isLoading={isLoading}
                onEdit={handleEditSubscriber}
                onDelete={handleDeleteSubscriber}
              />
            </TabsContent>
            
            <TabsContent value="events" className="mt-4">
              <SubscriberList
                subscribers={subscribers.filter(s => s.groups?.includes('Events'))}
                isLoading={isLoading}
                onEdit={handleEditSubscriber}
                onDelete={handleDeleteSubscriber}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SubscriberManager;
