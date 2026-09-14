
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePhoneValidation } from "./usePhoneValidation";

export const useWhatsAppNotification = () => {
  const { validatePhone } = usePhoneValidation();
  
  const sendWhatsAppNotification = async (registrationData: any) => {
    try {
      console.log("🔍 [WhatsApp] Notification Process Started via Edge Function");

      let rawPhone = registrationData.attendee.phone;
      const { isValid, cleanedPhone, message } = validatePhone(rawPhone, '');
      
      if (!isValid) {
        console.error("❌ [WhatsApp] Invalid Phone Number Format:", cleanedPhone);
        sonnerToast.error("WhatsApp Notification Failed", {
          description: message || "Invalid phone number format.",
          duration: 5000
        });
        return { error: true, message: message || "Invalid phone number format", details: { rawPhone, cleanedPhone } };
      }

      const event = registrationData.event;
      const messageText = `✅ *Registration Confirmed for Gate Gaborone!*

*Event:* ${event.title}
*Date:* ${event.date}
*Time:* ${event.time || 'TBA'}
*Location:* ${event.location || 'TBA'}
📍 *Get Directions:* https://www.google.com/maps/search/?api=1&query=Ditlhareng+Estate+Gabane

🙋‍♂️ *Registration Details:*
*Name:* ${registrationData.attendee.name}
*Email:* ${registrationData.attendee.email}
*Phone:* ${registrationData.attendee.phone}
*Number of Attendees:* ${registrationData.attendee.numberOfAttendees || 1}

Your registration has been confirmed. We look forward to seeing you!
Save this message for your reference.

For enquiries, WhatsApp: +267 72171066

*Reach | Resource | Reform*
- The Gate Gaborone Team`;

      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { phone: cleanedPhone, message: messageText }
      });

      if (error) {
        console.error("❌ [WhatsApp] Edge Function Error:", error);
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message.",
          duration: 5000
        });
        return { error: true, message: error.message || "Unknown WhatsApp error", details: error };
      }
      
      if (data && !data.error) {
        sonnerToast.success("WhatsApp Confirmation Sent", {
          description: "Confirmation sent to your WhatsApp.",
          duration: 5000
        });
        return data;
      } else {
        sonnerToast.error("WhatsApp Notification Issue", {
          description: "Could not send WhatsApp message.",
          duration: 5000
        });
        return { error: true, message: data?.error || "Unknown WhatsApp error", details: data };
      }
    } catch (error) {
      console.error("🚨 [WhatsApp] Exception:", error);
      sonnerToast.error("WhatsApp Notification Error", {
        description: "Technical error sending message.",
        duration: 5000
      });
      return { error: true, message: error instanceof Error ? error.message : "Unknown error", details: error };
    }
  };

  return { sendWhatsAppNotification };
};
