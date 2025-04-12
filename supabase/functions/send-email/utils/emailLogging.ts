// In-memory storage for email delivery logs
// Note: this will be cleared when the function is restarted
const emailDeliveryLogs: EmailDeliveryLog[] = [];

interface EmailDeliveryLog {
  id: string;
  timestamp: string;
  recipient: string;
  emailType: 'admin' | 'confirmation' | 'test';
  status: 'sent' | 'failed';
  details: any;
  messageId?: string;
}

// Add a log entry for email delivery
export function logEmailDelivery(
  recipient: string, 
  emailType: 'admin' | 'confirmation' | 'test', 
  status: 'sent' | 'failed',
  details: any = {},
  messageId?: string
) {
  const logEntry: EmailDeliveryLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    recipient,
    emailType,
    status,
    details,
    messageId
  };
  
  emailDeliveryLogs.push(logEntry);
  console.log(`Email delivery logged: ${emailType} to ${recipient} - ${status}`);
  
  // Keep only the last 50 logs
  if (emailDeliveryLogs.length > 50) {
    emailDeliveryLogs.shift();
  }
}

// Get all delivery logs
export function getDeliveryLogs() {
  return emailDeliveryLogs;
}

// Generate a simple report from the logs
export function generateDeliveryReport() {
  // Count successful and failed emails
  const sent = emailDeliveryLogs.filter(log => log.status === 'sent').length;
  const failed = emailDeliveryLogs.filter(log => log.status === 'failed').length;
  
  // Count by type
  const adminSent = emailDeliveryLogs.filter(log => log.emailType === 'admin' && log.status === 'sent').length;
  const adminFailed = emailDeliveryLogs.filter(log => log.emailType === 'admin' && log.status === 'failed').length;
  const confirmationSent = emailDeliveryLogs.filter(log => log.emailType === 'confirmation' && log.status === 'sent').length;
  const confirmationFailed = emailDeliveryLogs.filter(log => log.emailType === 'confirmation' && log.status === 'failed').length;
  const testSent = emailDeliveryLogs.filter(log => log.emailType === 'test' && log.status === 'sent').length;
  const testFailed = emailDeliveryLogs.filter(log => log.emailType === 'test' && log.status === 'failed').length;
  
  // Get recent logs
  const recentLogs = emailDeliveryLogs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
    .map(log => `${new Date(log.timestamp).toLocaleString()} - ${log.emailType} to ${log.recipient} - ${log.status}${log.status === 'failed' ? ` (${log.details.error})` : ''}`);
  
  // Recent failures
  const recentFailures = emailDeliveryLogs
    .filter(log => log.status === 'failed')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
    .map(log => `${new Date(log.timestamp).toLocaleString()} - ${log.emailType} to ${log.recipient} - ${log.details.error || 'Unknown error'}`);
  
  // Format the report
  return `
EMAIL DELIVERY MONITORING REPORT
=================================
Total emails processed: ${sent + failed}
Success rate: ${sent + failed > 0 ? Math.round((sent / (sent + failed)) * 100) : 0}%

BY TYPE:
  Admin emails:        ${adminSent} sent, ${adminFailed} failed
  Confirmation emails: ${confirmationSent} sent, ${confirmationFailed} failed
  Test emails:         ${testSent} sent, ${testFailed} failed

RECENT ACTIVITY:
${recentLogs.join('\n')}

${recentFailures.length > 0 ? `RECENT FAILURES:\n${recentFailures.join('\n')}` : 'No recent failures'}

Function uptime: ${getUptimeString()}
Logs will be cleared on function restart
=================================
`.trim();
}

// Helper to show how long the function has been running
let startTime = Date.now();

function getUptimeString() {
  const uptime = Date.now() - startTime;
  const seconds = Math.floor(uptime / 1000) % 60;
  const minutes = Math.floor(uptime / (1000 * 60)) % 60;
  const hours = Math.floor(uptime / (1000 * 60 * 60));
  
  return `${hours}h ${minutes}m ${seconds}s`;
}
