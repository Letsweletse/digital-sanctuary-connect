
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ULTRAMSG_API_KEY = Deno.env.get('ULTRAMSG_API_KEY');
const ULTRAMSG_INSTANCE_ID = '114633';

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

    console.log("📱 [Edge Function] WhatsApp notification for phone:", phone);
    console.log("💬 [Edge Function] Message:", message);

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
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

    const response = await fetch(`https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: ULTRAMSG_API_KEY,
        to: phone,
        body: finalMessage,
        priority: 10
      })
    });

    const responseData = await response.json();
    console.log("✅ WhatsApp API Response:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("❌ Error in WhatsApp function:", error);
    return new Response(JSON.stringify({
      error: true,
      message: error.message || "Something went wrong"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
