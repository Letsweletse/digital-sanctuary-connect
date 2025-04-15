
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendDirectWhatsAppMessage } from '@/utils/whatsAppUtils';
import { toast as sonnerToast } from "sonner";

/**
 * Example component showing how to use the direct WhatsApp message functionality
 * This is for demonstration purposes and can be used as a reference
 */
const DirectWhatsAppExample: React.FC = () => {
  const [phone, setPhone] = useState('+267');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !message) {
      sonnerToast.error("Missing information", {
        description: "Please provide both phone number and message",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const result = await sendDirectWhatsAppMessage(phone, message);
      
      if (result.error) {
        sonnerToast.error("Failed to send message", {
          description: result.message || "Unknown error occurred",
        });
      } else {
        sonnerToast.success("Message sent successfully", {
          description: "WhatsApp message has been sent",
        });
        setMessage(''); // Clear message field after successful send
      }
    } catch (error) {
      console.error("Error in WhatsApp example:", error);
      sonnerToast.error("Error sending message", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Direct WhatsApp Message</h2>
      
      <form onSubmit={handleSendMessage} className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number (with country code)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+267XXXXXXXX"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="mt-1 min-h-[100px]"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSending || !phone || !message}
          className="w-full"
        >
          {isSending ? 'Sending...' : 'Send WhatsApp Message'}
        </Button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>This example demonstrates sending WhatsApp messages directly using the Edge Function.</p>
        <p className="mt-2">Format phone numbers with country code: +267XXXXXXXX</p>
      </div>
    </div>
  );
};

export default DirectWhatsAppExample;
