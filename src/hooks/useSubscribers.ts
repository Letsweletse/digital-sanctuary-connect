
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Subscriber, SubscriberSchema } from '@/types/subscriberTypes';
import { subscribersData as initialData } from '@/data/subscribersData';
import useMongoData from '@/hooks/useMongoData';

export const useSubscribers = () => {
  const [localSubscribers, setLocalSubscribers] = useState<Subscriber[]>([]);
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  const { toast } = useToast();

  // Connect to MongoDB using the existing hook
  const { 
    data: mongoSubscribers, 
    isLoading: mongoLoading, 
    error: mongoError,
    addData,
    updateData,
    deleteData,
    refreshData
  } = useMongoData<Subscriber>('subscribers', {}, { limit: 1000 });

  // Determine if we should use mock data or real data
  const subscribers = isUsingMockData ? localSubscribers : mongoSubscribers;
  const isLoading = isUsingMockData ? false : mongoLoading;

  useEffect(() => {
    // Check if we got real data from MongoDB
    if (mongoSubscribers && mongoSubscribers.length > 0) {
      setIsUsingMockData(false);
      console.log('Using real subscriber data from database:', mongoSubscribers.length, 'records');
    } else if (mongoError) {
      console.error('Error loading subscribers from MongoDB:', mongoError);
      console.log('Falling back to mock data');
      loadLocalData();
    } else if (!mongoLoading && mongoSubscribers && mongoSubscribers.length === 0) {
      console.log('No subscribers found in database, using mock data');
      loadLocalData();
    }
  }, [mongoSubscribers, mongoLoading, mongoError]);

  const loadLocalData = () => {
    try {
      // Load from localStorage if available, otherwise use initial data
      const storedData = localStorage.getItem('church_subscribers');
      if (storedData) {
        setLocalSubscribers(JSON.parse(storedData));
      } else {
        setLocalSubscribers(initialData);
        // Save initial data to localStorage
        localStorage.setItem('church_subscribers', JSON.stringify(initialData));
      }
      setIsUsingMockData(true);
    } catch (error) {
      console.error('Error loading subscribers from localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to load subscribers. Please try again.",
        variant: "destructive",
      });
      setLocalSubscribers(initialData);
      setIsUsingMockData(true);
    }
  };

  const addSubscriber = async (subscriberData: Omit<Subscriber, 'id'>) => {
    try {
      // Validate with Zod schema
      SubscriberSchema.parse(subscriberData);

      if (isUsingMockData) {
        // Local storage approach (mock data)
        const newSubscriber: Subscriber = {
          ...subscriberData,
          id: `subscriber-${Date.now()}`
        };

        // Update state and localStorage
        const updatedSubscribers = [...localSubscribers, newSubscriber];
        setLocalSubscribers(updatedSubscribers);
        localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

        toast({
          title: "Success",
          description: "Subscriber added successfully.",
        });

        return newSubscriber;
      } else {
        // MongoDB approach (real data)
        const result = await addData(subscriberData);
        toast({
          title: "Success",
          description: "Subscriber added successfully to database.",
        });
        return result;
      }
    } catch (error: any) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add subscriber.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSubscriber = async (id: string, updates: Partial<Omit<Subscriber, 'id'>>) => {
    try {
      if (isUsingMockData) {
        // Local storage approach (mock data)
        const subscriberIndex = localSubscribers.findIndex(s => s.id === id);
        if (subscriberIndex === -1) {
          throw new Error("Subscriber not found");
        }

        const updatedSubscriber = {
          ...localSubscribers[subscriberIndex],
          ...updates
        };

        const updatedSubscribers = [...localSubscribers];
        updatedSubscribers[subscriberIndex] = updatedSubscriber;
        
        setLocalSubscribers(updatedSubscribers);
        localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

        toast({
          title: "Success",
          description: "Subscriber updated successfully.",
        });

        return updatedSubscriber;
      } else {
        // MongoDB approach (real data)
        const result = await updateData(id, updates);
        toast({
          title: "Success",
          description: "Subscriber updated successfully in database.",
        });
        return result;
      }
    } catch (error: any) {
      console.error('Error updating subscriber:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update subscriber.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      if (isUsingMockData) {
        // Local storage approach (mock data)
        const updatedSubscribers = localSubscribers.filter(s => s.id !== id);
        
        setLocalSubscribers(updatedSubscribers);
        localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

        toast({
          title: "Success",
          description: "Subscriber deleted successfully.",
        });
      } else {
        // MongoDB approach (real data)
        await deleteData(id);
        toast({
          title: "Success",
          description: "Subscriber deleted successfully from database.",
        });
      }
    } catch (error: any) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscriber.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const bulkImport = async (newSubscribers: Omit<Subscriber, 'id'>[]) => {
    try {
      const validSubscribers = newSubscribers.map(sub => {
        SubscriberSchema.parse(sub);
        return sub;
      });

      if (isUsingMockData) {
        // Local storage approach (mock data)
        const subscribersWithIds = validSubscribers.map(sub => ({
          ...sub,
          id: `subscriber-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }));

        const updatedSubscribers = [...localSubscribers, ...subscribersWithIds];
        setLocalSubscribers(updatedSubscribers);
        localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

        toast({
          title: "Success",
          description: `${validSubscribers.length} subscribers imported successfully.`,
        });

        return subscribersWithIds;
      } else {
        // MongoDB approach (real data)
        // Add each subscriber to the database
        const promises = validSubscribers.map(sub => addData(sub));
        await Promise.all(promises);
        refreshData(); // Refresh the data after bulk import

        toast({
          title: "Success",
          description: `${validSubscribers.length} subscribers imported successfully to database.`,
        });

        return validSubscribers;
      }
    } catch (error: any) {
      console.error('Error importing subscribers:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import subscribers.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const exportSubscribers = (format: 'csv' | 'json' = 'csv') => {
    try {
      if (format === 'csv') {
        // Convert to CSV
        const headers = ["id", "email", "firstName", "lastName", "source", "subscribeDate", "unsubscribed", "groups", "lastContactDate"];
        const csvRows = [headers.join(',')];
        
        subscribers.forEach(sub => {
          const row = [
            sub.id,
            sub.email,
            sub.firstName || '',
            sub.lastName || '',
            sub.source,
            sub.subscribeDate instanceof Date ? sub.subscribeDate.toISOString() : sub.subscribeDate,
            sub.unsubscribed ? 'true' : 'false',
            (sub.groups || []).join(';'),
            sub.lastContactDate ? (sub.lastContactDate instanceof Date ? sub.lastContactDate.toISOString() : sub.lastContactDate) : ''
          ];
          
          csvRows.push(row.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'church_subscribers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Export as JSON
        const jsonContent = JSON.stringify(subscribers, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'church_subscribers.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Success",
        description: "Subscribers exported successfully.",
      });
    } catch (error: any) {
      console.error('Error exporting subscribers:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to export subscribers.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    subscribers,
    isLoading,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    bulkImport,
    exportSubscribers,
    isUsingMockData,
    refreshData: isUsingMockData ? () => {} : refreshData
  };
};
