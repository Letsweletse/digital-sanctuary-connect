
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { v4 as uuidv4 } from "https://deno.land/std@0.190.0/uuid/mod.ts";

// CORS headers for cross-origin support
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get API key from environment or use the provided verified key
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_bGSLW5ST_HXvVo4ZUjY88qADUKpSd42Ac";
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
    
    // Check if this is a request for logs
    if (body.requestType === 'logs') {
      log("Logs request received");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email logs feature not available in this simplified version",
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
    }
    
    log("Received email request", { to: body.to, subject: body.subject });

    // Basic validation
    if (!body.to || !body.subject) {
      throw new Error("Missing required fields: 'to' and 'subject'");
    }

    // Prepare email data
    const emailData = {
      from: "Gate Gaborone <info@gategaborone.com>",
      to: Array.isArray(body.to) ? body.to : [body.to],
      subject: body.subject,
      html: body.html || `<p>${body.text || "No content provided"}</p>`,
      text: body.text || "No text content provided"
    };

    // Send email via Resend
    log("Sending email with Resend API", { to: emailData.to, subject: emailData.subject });
    const result = await resend.emails.send(emailData);

    log("Email sent successfully", { messageId: result.id });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
        timestamp: new Date().toISOString(),
        apiKeyUsed: `${RESEND_API_KEY.substring(0, 5)}...`,
        recipientCount: Array.isArray(body.to) ? body.to.length : 1
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
        timestamp: new Date().toISOString(),
        apiKeyUsed: `${RESEND_API_KEY.substring(0, 5)}...`
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
