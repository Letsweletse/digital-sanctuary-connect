
import React, { useState } from 'react';
import { useSubscribers } from '@/hooks/useSubscribers';
import SubscriberForm from './subscriber/SubscriberForm';
import SubscriberImport from './subscriber/SubscriberImport';
import DatabaseStatus from './subscriber/DatabaseStatus';
import { Subscriber, SubscriberFilter } from '@/types/subscriberTypes';
import SubscriberToolbar from './subscriber/SubscriberToolbar';
import SubscriberTabs from './subscriber/SubscriberTabs';
import { getFilteredSubscribers } from './subscriber/subscriberUtils';

const SubscriberManager = () => {
  const {
    subscribers,
    isLoading,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    bulkImport,
    exportSubscribers,
    isUsingMockData,
    refreshData
  } = useSubscribers();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [activeTab, setActiveTab] = useState<SubscriberFilter>('all');
  
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

  const getFilteredSubscribersForTab = (filter: SubscriberFilter) => {
    return getFilteredSubscribers(subscribers, filter);
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
          <SubscriberToolbar
            onAddSubscriber={handleAddSubscriber}
            onShowImport={handleShowImport}
            onExport={handleExport}
          />
          
          <DatabaseStatus 
            isUsingMockData={isUsingMockData} 
            refreshData={refreshData} 
            isLoading={isLoading}
          />
          
          <SubscriberTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            subscribers={subscribers}
            isLoading={isLoading}
            onEdit={handleEditSubscriber}
            onDelete={handleDeleteSubscriber}
            getFilteredSubscribers={getFilteredSubscribersForTab}
          />
        </>
      )}
    </div>
  );
};

export default SubscriberManager;
