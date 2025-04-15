
/**
 * Utility for sending WhatsApp notifications directly using fetch API
 * This can be used independently alongside the existing hook-based implementation
 */

/**
 * Send a WhatsApp notification directly using the Supabase Edge Function
 * @param phone - Phone number with country code (e.g. +26771234567)
 * @param message - Message to send via WhatsApp
 * @returns Promise with the response data
 */
export const sendDirectWhatsAppMessage = async (phone: string, message: string) => {
  try {
    console.log("📱 [Direct WhatsApp] Sending message to:", phone);
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.error("❌ [Direct WhatsApp] Invalid phone number format:", phone);
      return {
        error: true,
        message: "Invalid phone number format. Please provide number with country code (e.g. +267XXXXXXXX)"
      };
    }
    
    // Add Gate Gaborone branding if not present
    let finalMessage = message;
    if (!finalMessage.includes("Gate Gaborone") && !finalMessage.includes("Reach | Resource | Reform")) {
      finalMessage += "\n\nGate Gaborone - Reach | Resource | Reform";
    }
    
    // Call the Supabase Edge Function directly with fetch
    const response = await fetch("https://lojchdvtwypjqupsjynf.supabase.co/functions/v1/send-whatsapp", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        phone: phone,
        message: finalMessage
      })
    });
    
    if (!response.ok) {
      throw new Error(`WhatsApp API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ [Direct WhatsApp] Message sent successfully:", data);
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("🚨 [Direct WhatsApp] Error sending message:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Unknown error sending WhatsApp message"
    };
  }
};

/**
 * Example usage:
 * 
 * // Simple message
 * await sendDirectWhatsAppMessage("+26771234567", "Hello from Gate Gaborone!");
 * 
 * // Registration confirmation with formatting
 * await sendDirectWhatsAppMessage(
 *   "+26771234567", 
 *   `✅ *Registration Confirmed for Gate Gaborone!*
 *   
 *   *Event:* Conference Name
 *   *Date:* May 10, 2025
 *   *Time:* 9:00 AM
 *   
 *   We look forward to seeing you!
 *   
 *   *Reach | Resource | Reform*
 *   - The Gate Gaborone Team`
 * );
 */
