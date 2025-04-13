
import { deliveryMetrics } from "../index.ts";

// Helper for structured logging
export const logMessage = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Resend Email Function] ${message}`, data ? data : '');
};

// Track metrics for monitoring
export const trackDeliveryMetrics = (isSuccess: boolean, emailInfo: { to: string[] }) => {
  if (isSuccess) {
    deliveryMetrics.successfulDeliveries++;
    
    // Store recipient information for logging
    const recipientInfo = `${emailInfo.to.join(',')} - ${new Date().toISOString()}`;
    deliveryMetrics.emailsSent.push(recipientInfo);
    
    // Trim the history if it gets too large
    if (deliveryMetrics.emailsSent.length > 100) {
      deliveryMetrics.emailsSent = deliveryMetrics.emailsSent.slice(-100);
    }
  } else {
    deliveryMetrics.failedDeliveries++;
  }
};
