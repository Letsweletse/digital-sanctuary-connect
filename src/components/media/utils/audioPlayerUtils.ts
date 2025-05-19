import { format } from 'date-fns';
import { Sermon } from '@/types/sermonTypes';

// Format time in mm:ss format
export const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds)) return '00:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Format date to MMM d, yyyy format
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

// Convert any date format to a consistent Date object
export const normalizeDate = (date: Date | string | any): Date => {
  if (!date) return new Date();
  
  // If it's already a Date object
  if (date instanceof Date) {
    return date;
  }
  
  // Handle serialized dates from localStorage or API
  if (typeof date === 'object' && date._type === 'Date' && date.value) {
    return new Date(date.value.iso || date.value.local || date.value.value);
  }
  
  // Handle string dates
  if (typeof date === 'string') {
    return new Date(date);
  }
  
  // Default fallback
  return new Date();
};

/**
 * Process sermons to ensure consistent date formatting across devices
 * @param sermons Array of sermons to filter
 * @returns Processed array of sermons with normalized dates
 */
export const processSermons = (sermons: Sermon[]): Sermon[] => {
  if (!sermons || !Array.isArray(sermons)) return [];
  
  return sermons.map(sermon => ({
    ...sermon,
    date: normalizeDate(sermon.date)
  }));
};

/**
 * Get sermons from the same series
 * @param sermons All available sermons
 * @param currentSermon The current sermon
 * @returns Array of sermons from the same series as the current sermon
 */
export const getSermonsFromSameSeries = (sermons: Sermon[], currentSermon: Sermon): Sermon[] => {
  if (!currentSermon || !currentSermon.series || !sermons) return [];
  
  return sermons.filter(sermon => 
    sermon.series && 
    sermon.series.toLowerCase() === currentSermon.series?.toLowerCase()
  ).sort((a, b) => normalizeDate(a.date).getTime() - normalizeDate(b.date).getTime());
};

// Trigger sermon refresh (for use across components)
export const refreshSermons = () => {
  console.log('Manually refreshing sermons...');
  window.dispatchEvent(new Event('sermon-refresh'));
};

// Check if audio URL is valid and reachable
export const checkAudioUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking audio URL:', error);
    return false;
  }
};

// Helper function to get formatted duration
export const getFormattedDuration = (timeInSeconds: number): string => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00';
  return formatTime(timeInSeconds);
};
