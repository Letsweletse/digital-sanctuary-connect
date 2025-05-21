
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Subscriber, SubscriberSchema } from '@/types/subscriberTypes';
import { subscribersData as initialData } from '@/data/subscribersData';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch subscribers
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Load from localStorage if available, otherwise use initial data
        const storedData = localStorage.getItem('church_subscribers');
        if (storedData) {
          setSubscribers(JSON.parse(storedData));
        } else {
          setSubscribers(initialData);
          // Save initial data to localStorage
          localStorage.setItem('church_subscribers', JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Error loading subscribers:', error);
        toast({
          title: "Error",
          description: "Failed to load subscribers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const addSubscriber = (subscriberData: Omit<Subscriber, 'id'>) => {
    try {
      // Validate with Zod schema
      SubscriberSchema.parse(subscriberData);
      
      // Create new subscriber with ID
      const newSubscriber: Subscriber = {
        ...subscriberData,
        id: `subscriber-${Date.now()}`
      };

      // Update state and localStorage
      const updatedSubscribers = [...subscribers, newSubscriber];
      setSubscribers(updatedSubscribers);
      localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

      toast({
        title: "Success",
        description: "Subscriber added successfully.",
      });

      return newSubscriber;
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

  const updateSubscriber = (id: string, updates: Partial<Omit<Subscriber, 'id'>>) => {
    try {
      const subscriberIndex = subscribers.findIndex(s => s.id === id);
      if (subscriberIndex === -1) {
        throw new Error("Subscriber not found");
      }

      const updatedSubscriber = {
        ...subscribers[subscriberIndex],
        ...updates
      };

      const updatedSubscribers = [...subscribers];
      updatedSubscribers[subscriberIndex] = updatedSubscriber;
      
      setSubscribers(updatedSubscribers);
      localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

      toast({
        title: "Success",
        description: "Subscriber updated successfully.",
      });

      return updatedSubscriber;
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

  const deleteSubscriber = (id: string) => {
    try {
      const updatedSubscribers = subscribers.filter(s => s.id !== id);
      
      setSubscribers(updatedSubscribers);
      localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

      toast({
        title: "Success",
        description: "Subscriber deleted successfully.",
      });
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

  const bulkImport = (newSubscribers: Omit<Subscriber, 'id'>[]) => {
    try {
      const validSubscribers = newSubscribers.map(sub => {
        SubscriberSchema.parse(sub);
        return {
          ...sub,
          id: `subscriber-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };
      });

      const updatedSubscribers = [...subscribers, ...validSubscribers];
      setSubscribers(updatedSubscribers);
      localStorage.setItem('church_subscribers', JSON.stringify(updatedSubscribers));

      toast({
        title: "Success",
        description: `${validSubscribers.length} subscribers imported successfully.`,
      });

      return validSubscribers;
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
    exportSubscribers
  };
};
