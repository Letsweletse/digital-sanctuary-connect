
import { EmailDeliveryLog } from "../types/emailTypes.ts";

// In-memory log storage (persists until function restart)
const deliveryLogs: EmailDeliveryLog[] = [];

/**
 * Log an email delivery attempt
 */
export function logEmailDelivery(
  recipient: string, 
  emailType: 'admin' | 'confirmation',
  status: 'sent' | 'failed',
  details?: any,
  messageId?: string
): void {
  const logEntry: EmailDeliveryLog = {
    timestamp: new Date().toISOString(),
    recipient,
    emailType,
    status,
    messageId,
    details
  };
  
  // Add to memory logs
  deliveryLogs.push(logEntry);
  
  // Log to console for debugging
  console.log(`EMAIL DELIVERY LOG [${status.toUpperCase()}] ${emailType} to ${recipient}`, 
    messageId ? `ID: ${messageId}` : '',
    details ? `Details: ${JSON.stringify(details)}` : '');
}

/**
 * Get all delivery logs
 */
export function getDeliveryLogs(): EmailDeliveryLog[] {
  return [...deliveryLogs];
}

/**
 * Get delivery logs for a specific recipient
 */
export function getRecipientLogs(recipient: string): EmailDeliveryLog[] {
  return deliveryLogs.filter(log => log.recipient === recipient);
}

/**
 * Create a detailed monitoring report for diagnostics
 */
export function generateDeliveryReport(): string {
  if (deliveryLogs.length === 0) {
    return "No email delivery logs available.";
  }
  
  // Success rate statistics
  const totalAttempts = deliveryLogs.length;
  const successfulDeliveries = deliveryLogs.filter(log => log.status === 'sent').length;
  const failedDeliveries = totalAttempts - successfulDeliveries;
  const successRate = (successfulDeliveries / totalAttempts) * 100;
  
  // Admin vs confirmation email stats
  const adminEmails = deliveryLogs.filter(log => log.emailType === 'admin').length;
  const confirmationEmails = deliveryLogs.filter(log => log.emailType === 'confirmation').length;
  
  // Recent errors list (last 5)
  const recentErrors = deliveryLogs
    .filter(log => log.status === 'failed')
    .slice(-5)
    .map(log => ({
      timestamp: log.timestamp,
      recipient: log.recipient,
      emailType: log.emailType,
      details: log.details
    }));
  
  // Generate report
  const report = `
EMAIL DELIVERY MONITORING REPORT
===============================
Generated: ${new Date().toISOString()}

SUMMARY STATISTICS:
------------------
Total delivery attempts: ${totalAttempts}
Successful deliveries: ${successfulDeliveries} (${successRate.toFixed(2)}%)
Failed deliveries: ${failedDeliveries} (${(100 - successRate).toFixed(2)}%)

Email Types:
- Admin emails: ${adminEmails}
- Confirmation emails: ${confirmationEmails}

RECENT ERRORS (Last 5):
---------------------
${recentErrors.length > 0 
  ? recentErrors.map(err => 
      `Time: ${err.timestamp}\nRecipient: ${err.recipient}\nType: ${err.emailType}\nDetails: ${JSON.stringify(err.details)}\n`
    ).join('\n')
  : 'No recent errors.'}

DELIVERY LOG (Last 10 entries):
----------------------------
${deliveryLogs.slice(-10).map(log => 
  `[${log.timestamp}] ${log.status.toUpperCase()} ${log.emailType} to ${log.recipient}`
).join('\n')}
`;

  return report;
}
