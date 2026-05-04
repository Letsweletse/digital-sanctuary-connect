
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ULTRAMSG_API_KEY = Deno.env.get('ULTRAMSG_API_KEY');
const RAW_INSTANCE_ID = Deno.env.get('ULTRAMSG_INSTANCE_ID') || '114633';
const ULTRAMSG_INSTANCE_ID = RAW_INSTANCE_ID.replace(/^instance/i, '');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message } = await req.json();

    if (!ULTRAMSG_API_KEY) {
      console.error("❌ [Edge Function] ULTRAMSG_API_KEY is not configured");
      return new Response(JSON.stringify({
        error: true,
        message: "WhatsApp service is not configured"
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log("📱 [Edge Function] WhatsApp notification for phone:", phone);
    console.log("💬 [Edge Function] Message length:", message?.length);
    console.log("🔑 [Edge Function] Using API Key:", ULTRAMSG_API_KEY.substring(0, 5) + "...");
    console.log("🏢 [Edge Function] Using Instance ID:", ULTRAMSG_INSTANCE_ID);

    // Enhanced phone validation
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.error("❌ [Edge Function] Invalid phone format:", phone);
      return new Response(JSON.stringify({
        error: true,
        message: "Invalid phone number format. Please include country code. (e.g. +267XXXXXXXX)"
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let finalMessage = message;
    if (!finalMessage.includes("Gate Gaborone")) {
      finalMessage += "\n\nGate Gaborone - Reach | Resource | Reform";
    }

    // Use form-encoded data (correct format for UltraMsg API)
    const formData = new URLSearchParams();
    formData.append('token', ULTRAMSG_API_KEY);
    formData.append('to', phone.replace(/^\+/, ''));
    formData.append('body', finalMessage);
    formData.append('priority', '10');

    const apiUrl = `https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`;
    console.log("🌐 [Edge Function] Calling API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const responseText = await response.text();
    console.log("📥 [Edge Function] Raw API Response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      console.error("❌ [Edge Function] API Error:", response.status, responseData);
      return new Response(JSON.stringify({
        error: true,
        message: `WhatsApp API error: ${response.status}`,
        details: responseData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check for UltraMsg specific errors
    if (responseData.error) {
      console.error("❌ [Edge Function] UltraMsg Error:", responseData.error);
      return new Response(JSON.stringify({
        error: true,
        message: responseData.error,
        details: responseData
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log("✅ [Edge Function] WhatsApp message sent successfully:", responseData);

    return new Response(JSON.stringify({
      success: true,
      data: responseData,
      message: "WhatsApp message sent successfully"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("❌ [Edge Function] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong sending WhatsApp message";
    return new Response(JSON.stringify({
      error: true,
      message: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
