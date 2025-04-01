
import { useState, useEffect } from 'react';
import { findMany, insertOne, updateOne, deleteOne } from '@/lib/mongodb';

export function useMongoData<T>(
  collectionName: string, 
  query: Record<string, any> = {}, 
  options: Record<string, any> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await findMany(collectionName, query, options);
        
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
        console.error('Error fetching data from database', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(query), JSON.stringify(options)]);

  // Add functions to manage data
  const addData = async (newItem: Partial<T>) => {
    try {
      setIsLoading(true);
      const result = await insertOne(collectionName, newItem as Record<string, any>);
      
      // Refresh data after adding
      const updatedResult = await findMany(collectionName, query, options);
      const typedResult = updatedResult.map((doc: any) => {
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest } as unknown as T;
      });
      
      setData(typedResult);
      return result;
    } catch (err) {
      console.error('Error adding data to database', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (id: string, updates: Partial<T>) => {
    try {
      setIsLoading(true);
      const result = await updateOne(collectionName, { _id: id }, { $set: updates as Record<string, any> });
      
      // Refresh data after updating
      const updatedResult = await findMany(collectionName, query, options);
      const typedResult = updatedResult.map((doc: any) => {
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest } as unknown as T;
      });
      
      setData(typedResult);
      return result;
    } catch (err) {
      console.error('Error updating data in database', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await deleteOne(collectionName, { _id: id });
      
      // Remove from local state
      setData(prevData => prevData.filter((item: any) => item.id !== id));
      return result;
    } catch (err) {
      console.error('Error deleting data from database', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, addData, updateData, deleteData };
}

export default useMongoData;
