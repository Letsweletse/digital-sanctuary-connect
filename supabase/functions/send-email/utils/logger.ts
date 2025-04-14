
/**
 * Enhanced logging utility for edge functions
 */

// Enable or disable verbose logging
const VERBOSE_LOGGING = true;

/**
 * Log message with timestamp and request identifier
 * @param args Arguments to log
 */
export function logMessage(...args: any[]) {
  if (!VERBOSE_LOGGING && args[0]?.includes && args[0].includes("DEBUG:")) {
    // Skip debug messages in non-verbose mode
    return;
  }
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [SEND-EMAIL]`;
  
  console.log(prefix, ...args);
}

/**
 * Log error with timestamp and stack trace
 * @param message Error message
 * @param error Error object
 */
export function logError(message: string, error: any) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [SEND-EMAIL] [ERROR]`;
  
  console.error(prefix, message);
  
  if (error && error.stack) {
    console.error(prefix, "Stack trace:", error.stack);
  } else {
    console.error(prefix, "Error details:", error);
  }
}

/**
 * Log warning with timestamp
 * @param message Warning message
 */
export function logWarning(message: string) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [SEND-EMAIL] [WARNING]`;
  
  console.warn(prefix, message);
}
