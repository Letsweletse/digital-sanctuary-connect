
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ULTRAMSG_API_KEY = Deno.env.get('ULTRAMSG_API_KEY')!;
const ULTRAMSG_INSTANCE_ID = '114633'; // Using the provided instance ID

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message } = await req.json();

    console.log("📱 [Edge Function] WhatsApp notification for phone:", phone);
    console.log("💬 [Edge Function] Message:", message);

    // Add validation to ensure phone number is in correct format
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.error("❌ [Edge Function] Invalid Phone Number Format:", phone);
      return new Response(
        JSON.stringify({ 
          error: true, 
          message: "Invalid phone number format. Please provide number with country code (e.g. +267XXXXXXXX)"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Add Gate Gaborone branding in the footer if not present
    let finalMessage = message;
    if (!finalMessage.includes("Gate Gaborone")) {
      finalMessage += "\n\nGate Gaborone - Reach | Resource | Reform";
    }

    // Using specific instance URL as provided
    const response = await fetch(`https://api.ultramsg.com/instance114633/messages/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: ULTRAMSG_API_KEY,
        to: phone,
        body: finalMessage,
        priority: 10, // High priority for registration confirmations
      })
    });

    const responseData = await response.json();
    console.log("✅ [Edge Function] WhatsApp API response:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in WhatsApp notification function:', error);
    return new Response(JSON.stringify({ error: true, message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
