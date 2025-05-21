
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Subscriber, SubscriberSchema } from '@/types/subscriberTypes';
import { subscribersData as initialData } from '@/data/subscribersData';
import { supabase } from '@/integrations/supabase/client';

export const useSubscribers = () => {
  const [localSubscribers, setLocalSubscribers] = useState<Subscriber[]>([]);
  const [supabaseSubscribers, setSupabaseSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  const { toast } = useToast();
  
  // Determine which subscriber data to use
  const subscribers = isUsingMockData ? localSubscribers : supabaseSubscribers;
  
  // Fetch subscribers from Supabase
  useEffect(() => {
    const fetchSupabaseSubscribers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('subscribers')
          .select('*');
          
        if (error) {
          console.error('Error fetching subscribers from Supabase:', error);
          loadLocalData();
        } else if (data) {
          console.log('Fetched subscribers from Supabase:', data.length);
          
          // Transform Supabase data to match our Subscriber interface
          const transformedData = data.map(item => ({
            id: item.id,
            email: item.email,
            firstName: item.first_name || undefined,
            lastName: item.last_name || undefined,
            source: item.source,
            subscribeDate: item.subscribe_date,
            unsubscribed: item.unsubscribed || false,
            groups: item.groups || [],
            lastContactDate: item.last_contact_date || undefined
          }));
          
          setSupabaseSubscribers(transformedData);
          setIsUsingMockData(false);
        } else {
          // Fall back to local data if no data in Supabase
          loadLocalData();
        }
      } catch (error) {
        console.error('Error connecting to Supabase:', error);
        loadLocalData();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSupabaseSubscribers();
  }, []);
  
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
      
      toast({
        title: "Using mock data",
        description: "Could not connect to Supabase. Using local mock data instead.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error loading subscribers from localStorage:', error);
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
        // Supabase approach (real data)
        const { firstName, lastName, groups, lastContactDate, subscribeDate, ...rest } = subscriberData;
        
        // Convert Date objects to ISO strings for Supabase
        const subscribeString = subscribeDate instanceof Date 
          ? subscribeDate.toISOString() 
          : subscribeDate;
          
        const lastContactString = lastContactDate instanceof Date 
          ? lastContactDate.toISOString() 
          : lastContactDate;
        
        const { data, error } = await supabase
          .from('subscribers')
          .insert({
            first_name: firstName,
            last_name: lastName,
            groups: groups,
            last_contact_date: lastContactString,
            subscribe_date: subscribeString,
            ...rest
          })
          .select()
          .single();
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Transform response to match our Subscriber interface
        const newSubscriber: Subscriber = {
          id: data.id,
          email: data.email,
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          source: data.source,
          subscribeDate: data.subscribe_date,
          unsubscribed: data.unsubscribed || false,
          groups: data.groups || [],
          lastContactDate: data.last_contact_date || undefined
        };
        
        // Update our local state
        setSupabaseSubscribers(prev => [...prev, newSubscriber]);
        
        toast({
          title: "Success",
          description: "Subscriber added successfully to database.",
        });
        
        return newSubscriber;
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
        // Supabase approach (real data)
        const { firstName, lastName, groups, lastContactDate, subscribeDate, ...rest } = updates;
        
        const updateObject: any = { ...rest };
        if (firstName !== undefined) updateObject.first_name = firstName;
        if (lastName !== undefined) updateObject.last_name = lastName;
        if (groups !== undefined) updateObject.groups = groups;
        
        // Convert Date objects to ISO strings for Supabase
        if (lastContactDate !== undefined) {
          updateObject.last_contact_date = lastContactDate instanceof Date
            ? lastContactDate.toISOString()
            : lastContactDate;
        }
        
        if (subscribeDate !== undefined) {
          updateObject.subscribe_date = subscribeDate instanceof Date
            ? subscribeDate.toISOString()
            : subscribeDate;
        }
        
        const { data, error } = await supabase
          .from('subscribers')
          .update(updateObject)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Transform the response
        const updatedSubscriber: Subscriber = {
          id: data.id,
          email: data.email,
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          source: data.source,
          subscribeDate: data.subscribe_date,
          unsubscribed: data.unsubscribed || false,
          groups: data.groups || [],
          lastContactDate: data.last_contact_date || undefined
        };
        
        // Update our local state
        setSupabaseSubscribers(prev => 
          prev.map(s => s.id === id ? updatedSubscriber : s)
        );
        
        toast({
          title: "Success",
          description: "Subscriber updated successfully in database.",
        });
        
        return updatedSubscriber;
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
        // Supabase approach (real data)
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('id', id);
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Update our local state
        setSupabaseSubscribers(prev => prev.filter(s => s.id !== id));
        
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
        // Supabase approach (real data)
        // Transform data for Supabase
        const transformedSubscribers = validSubscribers.map(sub => {
          // Convert Date objects to ISO strings for Supabase
          const subscribeString = sub.subscribeDate instanceof Date 
            ? sub.subscribeDate.toISOString() 
            : sub.subscribeDate;
            
          const lastContactString = sub.lastContactDate instanceof Date 
            ? sub.lastContactDate.toISOString() 
            : sub.lastContactDate;
            
          return {
            email: sub.email,
            first_name: sub.firstName,
            last_name: sub.lastName,
            source: sub.source,
            subscribe_date: subscribeString,
            unsubscribed: sub.unsubscribed || false,
            groups: sub.groups || [],
            last_contact_date: lastContactString
          };
        });
        
        const { data, error } = await supabase
          .from('subscribers')
          .insert(transformedSubscribers)
          .select();
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Transform the response
        const importedSubscribers = data.map((item: any) => ({
          id: item.id,
          email: item.email,
          firstName: item.first_name || undefined,
          lastName: item.last_name || undefined,
          source: item.source,
          subscribeDate: item.subscribe_date,
          unsubscribed: item.unsubscribed || false,
          groups: item.groups || [],
          lastContactDate: item.last_contact_date || undefined
        }));
        
        // Update our local state
        setSupabaseSubscribers(prev => [...prev, ...importedSubscribers]);
        
        toast({
          title: "Success",
          description: `${importedSubscribers.length} subscribers imported successfully to database.`,
        });
        
        return importedSubscribers;
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

  const refreshData = async () => {
    if (isUsingMockData) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscribers')
        .select('*');
        
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Transform Supabase data to match our Subscriber interface
        const transformedData = data.map(item => ({
          id: item.id,
          email: item.email,
          firstName: item.first_name || undefined,
          lastName: item.last_name || undefined,
          source: item.source,
          subscribeDate: item.subscribe_date,
          unsubscribed: item.unsubscribed || false,
          groups: item.groups || [],
          lastContactDate: item.last_contact_date || undefined
        }));
        
        setSupabaseSubscribers(transformedData);
      }
      
      toast({
        title: "Success",
        description: "Subscriber data refreshed successfully.",
      });
    } catch (error: any) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh subscriber data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    refreshData
  };
};
