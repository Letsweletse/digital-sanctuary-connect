
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendDirectWhatsAppMessage } from '@/utils/whatsAppUtils';
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

const WhatsAppTester = () => {
  const [fullName, setFullName] = useState("John Doe");
  const [phone, setPhone] = useState("+26771234567");
  const [email, setEmail] = useState("john@example.com");
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const sendDirectMethod = async () => {
    if (!phone) {
      sonnerToast.error("Error", { description: "Missing phone number. Cannot send WhatsApp confirmation." });
      return;
    }

    setIsSending(true);
    try {
      console.log("📲 [Test] Sending WhatsApp directly to:", phone);
      
      const message = `✅ *Registration Confirmed for Gate Gaborone!*\n
*Event:* Perspectives on the Apostolic with Thamo Naidoo
*Date:* May 10, 2025
*Time:* 9:00 AM – 13:30 PM
*Location:* Gate Gaborone Auditorium
*Map:* https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96

🙋‍♂️ *Registration Details:*
*Name:* ${fullName}
*Email:* ${email}
*Phone:* ${phone}

Your registration has been confirmed. We look forward to seeing you!
Save this message for your reference.

*GATE GABORONE*
_Reach | Resource | Reform_`;

      // Using direct UltraMsg API method now
      const result = await sendDirectWhatsAppMessage(phone, message);
      console.log("📊 [Test] Direct WhatsApp result:", result);
      setLastResult(result);
      
      if (result.error) {
        sonnerToast.error("WhatsApp Error", { description: result.message });
      } else {
        sonnerToast.success("WhatsApp Sent", { description: "Message sent successfully via direct method" });
      }
    } catch (error) {
      console.error("❌ [Test] Direct WhatsApp error:", error);
      setLastResult({ error: true, message: error instanceof Error ? error.message : "Unknown error" });
      sonnerToast.error("WhatsApp Error", { description: "Failed to send WhatsApp message" });
    } finally {
      setIsSending(false);
    }
  };

  const sendViaEdgeFunction = async () => {
    if (!phone) {
      sonnerToast.error("Error", { description: "Missing phone number. Cannot send WhatsApp confirmation." });
      return;
    }

    setIsSending(true);
    try {
      console.log("📲 [Test] Sending WhatsApp via Edge Function to:", phone);
      
      const message = `✅ *Registration Confirmed for Gate Gaborone!*\n
*Event:* Perspectives on the Apostolic with Thamo Naidoo
*Date:* May 10, 2025
*Time:* 9:00 AM – 13:30 PM
*Location:* Gate Gaborone Auditorium
*Map:* https://maps.app.goo.gl/tKHAW2wV6sZ2yLy96

🙋‍♂️ *Registration Details:*
*Name:* ${fullName}
*Email:* ${email}
*Phone:* ${phone}

Your registration has been confirmed. We look forward to seeing you!
Save this message for your reference.

*GATE GABORONE*
_Reach | Resource | Reform_`;

      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: phone,
          message: message
        }
      });

      console.log("📊 [Test] Edge Function result:", data, error);
      setLastResult({ data, error });
      
      if (error) {
        sonnerToast.error("WhatsApp Error", { description: error.message });
      } else if (data && data.error) {
        sonnerToast.error("WhatsApp Error", { description: data.message || "Unknown error" });
      } else {
        sonnerToast.success("WhatsApp Sent", { description: "Message sent successfully via Edge Function" });
      }
    } catch (error) {
      console.error("❌ [Test] Edge Function error:", error);
      setLastResult({ error: true, message: error instanceof Error ? error.message : "Unknown error" });
      sonnerToast.error("WhatsApp Error", { description: "Failed to send WhatsApp message" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Message Tester</CardTitle>
          <CardDescription>Test sending WhatsApp notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (with country code)</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+26771234567"
            />
            <p className="text-xs text-gray-500">Format: +XXXXXXXXXXXX (include country code)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john@example.com"
            />
          </div>
          
          {lastResult && (
            <div className="mt-4 p-3 border rounded bg-gray-50 overflow-auto max-h-40">
              <p className="font-medium mb-1">Last Result:</p>
              <pre className="text-xs">{JSON.stringify(lastResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button 
              onClick={sendDirectMethod} 
              disabled={isSending} 
              className="w-full sm:w-1/2 bg-church-blue hover:bg-church-blue-dark"
            >
              {isSending ? "Sending..." : "Test Direct Method"}
            </Button>
            <Button 
              onClick={sendViaEdgeFunction} 
              disabled={isSending} 
              className="w-full sm:w-1/2 bg-church-blue hover:bg-church-blue-dark"
            >
              {isSending ? "Sending..." : "Test Edge Function"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WhatsAppTester;
