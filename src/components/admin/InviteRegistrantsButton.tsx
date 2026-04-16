
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, Mail, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';

const InviteRegistrantsButton = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<{ total: number; emailsSent: number; whatsappSent: number; errors: number } | null>(null);

  const handleSendInvitations = async () => {
    setIsSending(true);
    setResults(null);
    
    try {
      // Fetch all previous registrations
      const { data: registrations, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!registrations || registrations.length === 0) {
        toast({ title: 'No Registrants', description: 'No previous registrations found.', variant: 'destructive' });
        setIsSending(false);
        return;
      }

      // Get unique emails to avoid duplicates
      const uniqueRegistrants = new Map<string, any>();
      registrations.forEach(reg => {
        if (!uniqueRegistrants.has(reg.attendee_email)) {
          uniqueRegistrants.set(reg.attendee_email, reg);
        }
      });

      let emailsSent = 0;
      let whatsappSent = 0;
      let errors = 0;

      for (const [email, reg] of uniqueRegistrants) {
        try {
          // Send invitation email
          await supabase.functions.invoke('send-email', {
            body: {
              type: 'event_invitation',
              recipientName: reg.attendee_name,
              recipientEmail: email,
              recipientPhone: reg.attendee_phone,
              eventName: 'Perspectives On The Apostolic with Thamo Naidoo',
              eventDate: 'Saturday, 9 May 2026',
              eventTime: '09:00 - 13:30',
              eventLocation: 'Gate Gaborone, Plot 54014, Gaborone West',
            }
          });
          emailsSent++;

          // Send WhatsApp if phone available
          if (reg.attendee_phone) {
            try {
              await supabase.functions.invoke('send-whatsapp', {
                body: {
                  phone: reg.attendee_phone,
                  message: `Hi ${reg.attendee_name}! 👋\n\nYou're invited to *Perspectives On The Apostolic* with Thamo Naidoo!\n\n📅 Saturday, 9 May 2026\n⏰ 09:00 – 13:30\n📍 Gate Gaborone, Plot 54014, Gaborone West\n\n🎯 Sessions:\n• Session 1: 09:00–10:15\n• Session 2: 10:45–12:00\n• Session 3: 12:05–13:30\n\nRegistration is compulsory. Register here:\nhttps://www.gategaborone.co.bw/events\n\nRefreshments provided. Freewill offerings received.\n\nWe look forward to seeing you! 🙌\n\n— Gate Gaborone`
                }
              });
              whatsappSent++;
            } catch {
              console.log('WhatsApp failed for:', reg.attendee_phone);
            }
          }

          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
          errors++;
        }
      }

      setResults({ total: uniqueRegistrants.size, emailsSent, whatsappSent, errors });
      toast({
        title: 'Invitations Sent!',
        description: `Sent ${emailsSent} emails and ${whatsappSent} WhatsApp messages to ${uniqueRegistrants.size} registrants.`,
      });
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast({ title: 'Error', description: 'Failed to send invitations.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-500" />
          Send Invitations – Perspectives On The Apostolic (9 May 2026)
        </CardTitle>
        <CardDescription>
          Send email and WhatsApp invitations to all previously registered attendees for the upcoming Perspectives On The Apostolic event with Thamo Naidoo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-blue-900">Event Details:</p>
          <p className="text-sm text-blue-800">📅 Saturday, 9 May 2026</p>
          <p className="text-sm text-blue-800">⏰ 09:00 – 13:30 (3 Sessions)</p>
          <p className="text-sm text-blue-800">📍 Gate Gaborone, Plot 54014, Gaborone West</p>
          <p className="text-sm text-blue-800">🎤 Speaker: Thamo Naidoo</p>
        </div>

        <Button 
          onClick={handleSendInvitations} 
          disabled={isSending}
          size="lg"
          className="w-full"
        >
          {isSending ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending Invitations...</>
          ) : (
            <><Users className="h-4 w-4 mr-2" /> Send Invitations to All Previous Registrants</>
          )}
        </Button>

        {results && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle className="h-5 w-5" /> Invitation Results
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold">{results.total}</div>
                <div className="text-xs text-muted-foreground">Total Recipients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.emailsSent}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Mail className="h-3 w-3" /> Emails Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.whatsappSent}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><MessageCircle className="h-3 w-3" /> WhatsApp Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.errors}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InviteRegistrantsButton;
