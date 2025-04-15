
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePhoneValidation } from "./usePhoneValidation";
import { formatDate } from "@/utils/dateUtils";

export const useWhatsAppNotification = () => {
  const { validatePhone } = usePhoneValidation();
  
  const sendWhatsAppNotification = async (registrationData: any) => {
    try {
      console.log("🔍 [WhatsApp] Notification Process Started via Edge Function");
      console.log("📱 [WhatsApp] Registration Data:", JSON.stringify(registrationData, null, 2));

      let rawPhone = registrationData.attendee.phone;
      console.log("🚨 [WhatsApp] Raw Phone Number:", rawPhone);

      // Validate phone number
      const { isValid, cleanedPhone, message } = validatePhone(rawPhone, '');
      
      if (!isValid) {
        console.error("❌ [WhatsApp] Invalid Phone Number Format:", cleanedPhone);
        
        sonnerToast.error("WhatsApp Notification Failed", {
          description: message || "Invalid phone number format. Please check your number.",
          duration: 5000
        });

        return { 
          error: true, 
          message: message || "Invalid phone number format",
          details: { rawPhone, cleanedPhone }
        };
      }

      // Create a more detailed confirmation message
      const messageText = `✅ *Registration Confirmed!*\n
*Event:* ${registrationData.event.title}
*Date:* ${formatDate(registrationData.event.date)}
*Time:* ${registrationData.event.time}
*Location:* ${registrationData.event.location}
      
🙋‍♂️ *Registration Details:*
*Name:* ${registrationData.attendee.name}
*Email:* ${registrationData.attendee.email}
*Phone:* ${registrationData.attendee.phone}
*Number of Attendees:* ${registrationData.attendee.numberOfAttendees}

Your registration has been confirmed. We look forward to seeing you!
Save this message for your reference.

- The Gate Gaborone Team`;

      console.log("📨 [WhatsApp] Prepared Message:", messageText);
      console.log("🚀 [WhatsApp] Calling Supabase Edge Function");
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: cleanedPhone,
          message: messageText
        }
      });

      console.log("📋 [WhatsApp] Edge Function Response:", data);
      
      if (error) {
        console.error("❌ [WhatsApp] Edge Function Error:", error);
        
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message. Please check phone number format.",
          duration: 5000
        });
        
        return { 
          error: true, 
          message: error.message || "Unknown WhatsApp notification error",
          details: error
        };
      }
      
      if (data && !data.error) {
        console.log("✅ [WhatsApp] Notification Sent Successfully via Edge Function");
        
        sonnerToast.success("WhatsApp Confirmation Sent", {
          description: "Detailed confirmation sent to your WhatsApp.",
          duration: 5000
        });
        
        return data;
      } else {
        console.error("❌ [WhatsApp] API Error Response:", data);
        
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message. Please check phone number format.",
          duration: 5000
        });
        
        return { 
          error: true, 
          message: data?.error || "Unknown WhatsApp notification error",
          details: data
        };
      }
    } catch (error) {
      console.error("🚨 [WhatsApp] Exception Occurred:", error);
      console.error("[WhatsApp] Stack Trace:", error instanceof Error ? error.stack : "No stack trace");
      
      sonnerToast.error("WhatsApp Notification Error", {
        description: "Technical error sending message. Please contact support.",
        duration: 5000
      });

      return { 
        error: true, 
        message: error instanceof Error ? error.message : "Unknown error",
        details: error
      };
    }
  };

  return {
    sendWhatsAppNotification
  };
};
