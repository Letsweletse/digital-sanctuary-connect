
import { useState, useEffect } from 'react';
import { findMany, insertOne, updateOne, deleteOne } from '@/lib/mongodb';
import { toast } from 'sonner';

export function useMongoData<T>(
  collectionName: string, 
  query: Record<string, any> = {}, 
  options: Record<string, any> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh data
  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching data from ${collectionName} collection with query:`, query);
        
        const result = await findMany(collectionName, query, options);
        console.log(`Received ${result.length} records from ${collectionName} collection`);
        
        // Convert the _id to id for consistency
        const typedResult = result.map((doc: any) => {
          const { _id, ...rest } = doc;
          return { 
            id: _id.toString(), 
            ...rest 
          } as unknown as T;
        });
        
        setData(typedResult);
        setError(null);
      } catch (err) {
        console.error(`Error fetching data from ${collectionName} collection:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setData([]);
        toast.error(`Failed to load data from ${collectionName}. Please try refreshing.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(query), JSON.stringify(options), refreshTrigger]);

  // Add functions to manage data
  const addData = async (newItem: Partial<T>) => {
    try {
      setIsLoading(true);
      console.log(`Adding new item to ${collectionName} collection:`, newItem);
      
      const result = await insertOne(collectionName, newItem as Record<string, any>);
      console.log(`Insert result:`, result);
      
      toast.success('Data added successfully');
      refreshData(); // Refresh data after adding
      return result;
    } catch (err) {
      console.error(`Error adding data to ${collectionName} collection:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to add data. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (id: string, updates: Partial<T>) => {
    try {
      setIsLoading(true);
      console.log(`Updating item in ${collectionName} collection with id ${id}:`, updates);
      
      const result = await updateOne(collectionName, { _id: id }, { $set: updates as Record<string, any> });
      console.log(`Update result:`, result);
      
      toast.success('Data updated successfully');
      refreshData(); // Refresh data after updating
      return result;
    } catch (err) {
      console.error(`Error updating data in ${collectionName} collection:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to update data. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id: string) => {
    try {
      setIsLoading(true);
      console.log(`Deleting item from ${collectionName} collection with id ${id}`);
      
      const result = await deleteOne(collectionName, { _id: id });
      console.log(`Delete result:`, result);
      
      // Update local state immediately for better UX
      setData(prevData => prevData.filter((item: any) => item.id !== id));
      toast.success('Data deleted successfully');
      return result;
    } catch (err) {
      console.error(`Error deleting data from ${collectionName} collection:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to delete data. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    data, 
    isLoading, 
    error, 
    addData, 
    updateData, 
    deleteData,
    refreshData
  };
}

export default useMongoData;
