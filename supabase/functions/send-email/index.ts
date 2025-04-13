
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";

// CORS headers for cross-origin support
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from environment
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_FYtCFWri_39ciqWYc9CEKpoa3JdkWdSwN";
const resend = new Resend(RESEND_API_KEY);

// Logging function
const log = (message: string, data?: any) => {
  console.log(`[Resend Email Function] ${message}`, data || '');
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    log("Received email request", { to: body.to, subject: body.subject });

    // Basic validation
    if (!body.to || !body.subject) {
      throw new Error("Missing required fields: 'to' and 'subject'");
    }

    // Prepare email data
    const emailData = {
      from: "Gate Gaborone <info@gategaborone.com>",
      to: body.to,
      subject: body.subject,
      html: body.html || body.text || "No content provided",
      text: body.text || "No text content provided"
    };

    // Send email via Resend
    const result = await resend.emails.send(emailData);

    log("Email sent successfully", { messageId: result.id });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
        timestamp: new Date().toISOString()
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
    log("Error sending email", { error: error.message });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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

serve(handler);
