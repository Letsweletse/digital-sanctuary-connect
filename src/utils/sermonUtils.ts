
import { Sermon } from '@/types/sermonTypes';

/**
 * Creates a new sermon with a generated ID
 * @param sermon The sermon data without an ID
 * @returns A new sermon object with an ID
 */
export const createSermon = (sermon: Omit<Sermon, 'id'>): Sermon => {
  return {
    ...sermon,
    id: Date.now().toString(),
  };
};

/**
 * Updates a sermon in a sermon array
 * @param sermons Array of sermons
 * @param id ID of the sermon to update
 * @param updatedSermon Updated sermon data
 * @returns A new array with the updated sermon
 */
export const updateSermonInList = (
  sermons: Sermon[],
  id: string,
  updatedSermon: Partial<Sermon>
): Sermon[] => {
  return sermons.map(sermon => 
    sermon.id === id ? { ...sermon, ...updatedSermon } : sermon
  );
};

/**
 * Removes a sermon from a sermon array
 * @param sermons Array of sermons
 * @param id ID of the sermon to remove
 * @returns A new array without the removed sermon
 */
export const removeSermonFromList = (
  sermons: Sermon[],
  id: string
): Sermon[] => {
  return sermons.filter(sermon => sermon.id !== id);
};

/**
 * Finds a featured sermon from an array of sermons
 * @param sermons Array of sermons
 * @returns The featured sermon or undefined if none is found
 */
export const findFeaturedSermon = (sermons: Sermon[]): Sermon | undefined => {
  return sermons.find(sermon => sermon.featured);
};
