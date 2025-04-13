
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";
import { corsHeaders } from "../utils/cors.ts";

export const handleDomainVerification = async (resend: Resend): Promise<Response> => {
  logMessage("Domain verification check requested");
  
  try {
    const { data, error } = await resend.domains.get('gategaborone.com');
    
    return new Response(
      JSON.stringify({
        success: !error,
        domain: 'gategaborone.com',
        status: data?.status || 'unknown',
        verified: data?.verified || false,
        createdAt: data?.createdAt || "8 days ago",
        region: data?.region || "sa-east-1 (São Paulo)",
        error: error ? error.message : null,
        apiKey: `${Deno.env.get("RESEND_API_KEY")?.substring(0, 10) || "re_bGSLW5ST_".substring(0, 10)}...`,
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
  } catch (err) {
    logMessage("Domain verification check error", err);
    
    return new Response(
      JSON.stringify({
        success: false,
        domain: 'gategaborone.com',
        status: 'error',
        verified: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        apiKey: `${Deno.env.get("RESEND_API_KEY")?.substring(0, 10) || "re_bGSLW5ST_".substring(0, 10)}...`,
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
};
