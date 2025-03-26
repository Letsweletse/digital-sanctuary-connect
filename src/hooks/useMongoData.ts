
import { useState, useEffect } from 'react';
import { findMany } from '@/lib/mongodb';

export function useMongoData<T>(
  collectionName: string, 
  query: object = {}, 
  options: object = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await findMany(collectionName, query, options);
        setData(result as T[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching data from MongoDB', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(query), JSON.stringify(options)]);

  return { data, isLoading, error };
}

export default useMongoData;
