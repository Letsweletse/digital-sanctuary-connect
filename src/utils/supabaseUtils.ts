
/**
 * Utility functions for Supabase operations
 */

/**
 * Validates if a string is a valid UUID
 * @param id - String to check
 * @returns Boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Safely handles Supabase UUID parameters
 * @param id - ID to check and process
 * @returns Processed ID or null if invalid
 */
export const safeUUID = (id: string | undefined | null): string | null => {
  if (!id) return null;
  return isValidUUID(id) ? id : null;
};

/**
 * Creates a safe query filter for UUIDs
 * @param column - Column name to filter on
 * @param id - ID value to check
 * @returns Object with filter or empty object if invalid
 */
export const createUUIDFilter = (column: string, id: string | undefined | null) => {
  const safeId = safeUUID(id);
  return safeId ? { [column]: safeId } : {};
};

/**
 * Creates a safe equals filter 
 * @param column - Column name to filter on
 * @param value - Value to filter for
 * @returns Object with filter or empty object if invalid
 */
export const createEqualsFilter = (column: string, value: string | undefined | null) => {
  return value ? { [column]: value } : {};
};

/**
 * Handles potential errors from Supabase queries
 * @param error - Error object from Supabase
 * @param fallbackData - Optional fallback data to return
 * @throws Error with formatted message
 */
export const handleSupabaseError = (error: any, fallbackData?: any) => {
  if (error) {
    console.error('Supabase error:', error);
    if (fallbackData !== undefined) {
      console.warn('Using fallback data due to error');
      return fallbackData;
    }
    throw new Error(`Database operation failed: ${error.message || 'Unknown error'}`);
  }
};
