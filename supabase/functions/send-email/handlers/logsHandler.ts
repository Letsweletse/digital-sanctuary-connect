
import { corsHeaders } from "../utils/cors.ts";
import { logMessage } from "../utils/logger.ts";
import { generateDeliveryReport, getDeliveryLogs } from "../utils/emailLogging.ts";

export const handleLogsRequest = (
  deliveryMetrics: any,
  apiKey: string
): Response => {
  logMessage("Logs request received");
  
  // Get the last 15 logs for better visibility
  const recentLogs = getDeliveryLogs().slice(0, 15);
  
  // Generate a detailed delivery report
  const deliveryReport = generateDeliveryReport();
  
  // Prepare API key information (show partial key for security)
  const apiKeyInfo = apiKey ? `${apiKey.substring(0, 10)}...` : 'Not configured';
  
  // Check for system health
  const systemHealth = {
    status: deliveryMetrics.failedDeliveries > 5 ? 'degraded' : 'healthy',
    lastReset: new Date().toISOString(),
    activeConnections: true,
    emailServiceConnected: !!apiKey,
  };
  
  return new Response(
    JSON.stringify({
      success: true,
      message: "Email delivery metrics and system status",
      metrics: deliveryMetrics,
      apiKey: apiKeyInfo,
      timestamp: new Date().toISOString(),
      deliveryReport: deliveryReport,
      recentLogs: recentLogs,
      systemHealth: systemHealth,
      supabaseConnection: "active"
    }),
    { 
      status: 200, 
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      } 
    }
  );
};
