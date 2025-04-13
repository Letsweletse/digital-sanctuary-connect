
import { corsHeaders } from "../utils/cors.ts";
import { logMessage } from "../utils/logger.ts";
import { generateDeliveryReport, getDeliveryLogs } from "../utils/emailLogging.ts";

export const handleLogsRequest = (
  deliveryMetrics: any,
  apiKey: string
): Response => {
  logMessage("Logs request received");
  
  return new Response(
    JSON.stringify({
      success: true,
      message: "Email delivery metrics",
      metrics: deliveryMetrics,
      apiKey: `${apiKey.substring(0, 10)}...`,
      timestamp: new Date().toISOString(),
      deliveryReport: generateDeliveryReport(),
      recentLogs: getDeliveryLogs().slice(-10) // Return the most recent 10 logs
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
