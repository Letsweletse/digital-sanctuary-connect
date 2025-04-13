
import { corsHeaders } from "../utils/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { logMessage } from "../utils/logger.ts";

export const handleDomainVerification = async (resend: Resend): Promise<Response> => {
  try {
    logMessage("Checking domain verification status");
    
    // Get list of domains with better error handling
    let data;
    let error;
    
    try {
      const result = await resend.domains.list();
      data = result.data;
      error = result.error;
    } catch (apiError) {
      // Handle Resend API connection errors
      logMessage("Error connecting to Resend API:", apiError);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error connecting to Resend API: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
          apiConnected: false,
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
    
    if (error) {
      logMessage("Error checking domains:", error);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: `Error checking domains: ${error.message}`,
          apiConnected: true,
          domainVerified: false,
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
        apiConnected: true,
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
        apiConnected: false,
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
