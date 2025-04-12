
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { processEmailRequest } from "./handlers/processEmailRequest.ts";
import { processEmailRequest as processLegacyEmailRequest } from "./handlers/emailHandler.ts";
import { getEmailDeliveryLogs } from "./handlers/emailHandler.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Email edge function called with:", req.method, req.url);
    
    // Parse the URL to extract path
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop() || "";
    
    console.log("Parsed path:", path);

    // Route to the appropriate handler
    if (path === "logs" || url.pathname.endsWith("/logs")) {
      console.log("Routing to email logs endpoint");
      return await getEmailDeliveryLogs(req);
    } else if (path === "legacy" || url.pathname.endsWith("/legacy")) {
      console.log("Routing to legacy email handler");
      return await processLegacyEmailRequest(req);
    } else {
      console.log("Routing to new email handler");
      return await processEmailRequest(req);
    }
  } catch (error) {
    console.error("Error in email edge function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
