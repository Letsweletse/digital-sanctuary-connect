
import { corsHeaders } from "../utils/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";

export const handleDomainVerification = async (resend: Resend): Promise<Response> => {
  try {
    logMessage("Checking domain verification status");
    
    // Get list of domains
    const { data, error } = await resend.domains.list();
    
    if (error) {
      logMessage("Error checking domains:", error);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error checking domains: ${error.message}`,
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
    
    // Format the domain data
    const domainsData = Array.isArray(data) ? data.map(domain => ({
      id: domain.id,
      name: domain.name,
      status: domain.status,
      region: domain.region,
      createdAt: domain.created_at
    })) : [];
    
    // Check if any domains are verified
    const hasVerifiedDomains = domainsData.some(domain => domain.status === 'verified');
    
    // Get the primary domain (if any)
    const primaryDomain = domainsData.find(domain => domain.status === 'verified');
    
    return new Response(
      JSON.stringify({
        success: true,
        hasVerifiedDomains,
        primaryDomain: primaryDomain?.name || null,
        domains: domainsData,
        count: domainsData.length,
        verifiedCount: domainsData.filter(d => d.status === 'verified').length,
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
    logMessage("Unexpected error checking domains:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Unexpected error checking domains: ${error instanceof Error ? error.message : "Unknown error"}`,
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
