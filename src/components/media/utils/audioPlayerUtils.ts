
/**
 * Utility functions for audio player functionality
 */

/**
 * Format time in MM:SS
 */
export const formatTime = (time: number): string => {
  if (isNaN(time)) return "00:00";
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format date with date-fns
 */
import { format } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMMM d, yyyy');
};
