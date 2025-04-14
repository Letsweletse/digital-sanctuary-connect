
/**
 * Enhanced logging utility for edge functions
 */

// Enable or disable verbose logging
const VERBOSE_LOGGING = true;

/**
 * Log message with timestamp and request identifier
 * @param requestId Request identifier or log category
 * @param args Arguments to log
 */
export function logMessage(requestId: number | string, ...args: any[]) {
  if (!VERBOSE_LOGGING && args[0]?.includes && args[0].includes("DEBUG:")) {
    // Skip debug messages in non-verbose mode
    return;
  }
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [CHECK-RESEND] [REQ-${requestId}]`;
  
  console.log(prefix, ...args);
}

/**
 * Track metrics for the function
 * @param metrics Metrics object to update
 * @param key Metric to increment
 * @param value Value to add (default: 1)
 */
export function trackMetrics(metrics: any, key: string, value: number = 1) {
  if (!metrics[key]) {
    metrics[key] = 0;
  }
  
  metrics[key] += value;
}
