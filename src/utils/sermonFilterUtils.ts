
import { Sermon } from '@/types/sermonTypes';

/**
 * Filters sermons by a specific series name
 * @param sermons Array of sermons to filter
 * @param seriesName The name of the series to filter by
 * @returns Filtered array of sermons belonging to the specified series
 */
export const getSermonsBySeries = (sermons: Sermon[], seriesName: string): Sermon[] => {
  return sermons.filter(sermon => sermon.series === seriesName);
};

/**
 * Gets all unique series from sermon data
 * @param sermons Array of sermons
 * @returns Array of unique series names
 */
export const getAllSeriesList = (sermons: Sermon[]): string[] => {
  const seriesSet = new Set<string>();
  
  sermons.forEach(sermon => {
    if (sermon.series) {
      seriesSet.add(sermon.series);
    }
  });
  
  return Array.from(seriesSet);
};

/**
 * Gets a count of sermons per series
 * @param sermons Array of sermons
 * @returns Object with series names as keys and counts as values
 */
export const getSermonCountBySeries = (sermons: Sermon[]): Record<string, number> => {
  const seriesCount: Record<string, number> = {};
  
  sermons.forEach(sermon => {
    if (sermon.series) {
      seriesCount[sermon.series] = (seriesCount[sermon.series] || 0) + 1;
    }
  });
  
  return seriesCount;
};
