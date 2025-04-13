// Store delivery logs for monitoring
const deliveryLogs: {
  timestamp: string;
  recipient: string;
  emailType: string;
  status: 'sent' | 'failed';
  details?: any;
  id?: string;
}[] = [];

// Log email delivery attempts
export const logEmailDelivery = (
  recipient: string,
  emailType: string,
  status: 'sent' | 'failed',
  details?: any,
  id?: string
) => {
  // Add timestamp to each log entry
  const timestamp = new Date().toISOString();
  
  // Create structured log entry
  const logEntry = {
    timestamp,
    recipient,
    emailType,
    status,
    details,
    id
  };
  
  // Add to the in-memory logs array
  deliveryLogs.unshift(logEntry);
  
  // Trim logs if they get too large (keep last 100)
  if (deliveryLogs.length > 100) {
    deliveryLogs.length = 100;
  }
  
  // Log to console for server-side debugging
  console.log(`[EMAIL LOG] ${timestamp} - ${status.toUpperCase()} - To: ${recipient} - Type: ${emailType}`, details || '');
  
  return logEntry;
};

// Get delivery logs for monitoring
export const getDeliveryLogs = () => {
  return deliveryLogs;
};

// Generate a delivery report for monitoring
export const generateDeliveryReport = () => {
  const totalEmails = deliveryLogs.length;
  const successfulEmails = deliveryLogs.filter(log => log.status === 'sent').length;
  const failedEmails = deliveryLogs.filter(log => log.status === 'failed').length;
  
  const lastError = deliveryLogs.find(log => log.status === 'failed')?.details || null;
  
  const lastSuccessful = deliveryLogs.find(log => log.status === 'sent') || null;
  
  return {
    totalDelivered: successfulEmails,
    totalFailed: failedEmails,
    totalAttempts: totalEmails,
    successRate: totalEmails > 0 ? (successfulEmails / totalEmails) * 100 : 0,
    lastErrorDetails: lastError,
    lastSuccessfulDelivery: lastSuccessful,
    timeGenerated: new Date().toISOString(),
    reportTitle: 'EMAIL DELIVERY MONITORING REPORT'
  };
};

// Helper to show how long the function has been running
let startTime = Date.now();

function getUptimeString() {
  const uptime = Date.now() - startTime;
  const seconds = Math.floor(uptime / 1000) % 60;
  const minutes = Math.floor(uptime / (1000 * 60)) % 60;
  const hours = Math.floor(uptime / (1000 * 60 * 60));
  
  return `${hours}h ${minutes}m ${seconds}s`;
}
