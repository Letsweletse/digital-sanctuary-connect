
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { processEmailRequest } from "./handlers/emailHandler.ts";

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called with method:", req.method);
  console.log("Request URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing email request...");
    const response = await processEmailRequest(req);
    console.log("Email request processed with status:", response.status);
    return response;
  } catch (error: any) {
    console.error("Fatal error in send-email function:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace available";
    
    console.error("Error details:", errorMessage);
    console.error("Stack trace:", errorStack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        provider: "Mailgun",
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

console.log("Email function initialized with Mailgun provider");
console.log("Mailgun domain: gategaborone.com");
serve(handler);
