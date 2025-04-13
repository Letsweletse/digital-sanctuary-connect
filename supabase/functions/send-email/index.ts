import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";

// Track function uptime and request count
const functionStartTime = Date.now();
let requestCount = 0;

// Structured logger
const log = (requestId: number, message: string, data?: any) => {
  console.log(`[Request #${requestId}] ${message}`, data ? JSON.stringify(data).substring(0, 200) + "..." : "");
};

// Handler for fallback email logic (simulated RESEND fallback)
const handler = async (req: Request): Promise<Response> => {
  requestCount++;
  const currentRequest = requestCount;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  log(currentRequest, "Processing POST request to fallback email function");
  log(currentRequest, "Function uptime:", Math.floor((Date.now() - functionStartTime) / 1000) + " seconds");

  try {
    const body = await req.json();
    log(currentRequest, "Received request body", body);

    // Simulate a successful fallback send via RESEND (placeholder)
    log(currentRequest, "Simulating fallback email send via RESEND");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent via fallback service",
        provider: "resend-fallback",
        messageId: `fallback-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    log(currentRequest, "Error in fallback function", { error: error.message });

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

// Log shutdown info
addEventListener("beforeunload", (event) => {
  console.log("Fallback function shutting down at", new Date().toISOString());
  console.log("Function ran for", Math.floor((Date.now() - functionStartTime) / 1000), "seconds");
  console.log("Handled", requestCount, "requests");
  console.log("Shutdown reason:", event.detail?.reason || "unknown");
});

serve(handler);

