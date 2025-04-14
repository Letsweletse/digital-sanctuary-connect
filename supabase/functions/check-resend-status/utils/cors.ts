
// CORS headers for cross-origin requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-id",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Handle CORS preflight requests
export function handleCorsRequest(): Response {
  return new Response(null, {
    status: 204, // No content
    headers: corsHeaders
  });
}
