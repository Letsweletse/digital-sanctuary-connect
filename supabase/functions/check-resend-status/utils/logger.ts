
import { metrics } from "../index.ts";

// Helper for structured logging
export const logMessage = (requestId: number, message: string, data?: any) => {
  console.log(`[Request #${requestId}] ${message}`, data ? JSON.stringify(data).substring(0, 200) + "..." : "");
};

// Track metrics for monitoring
export const trackMetrics = (isSuccess: boolean) => {
  if (isSuccess) {
    metrics.successfulChecks++;
  } else {
    metrics.failedChecks++;
  }
};
