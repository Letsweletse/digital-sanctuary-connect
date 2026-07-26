
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, Mail, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { sendDirectWhatsAppMessage } from '@/utils/whatsAppUtils';

const TARGET_EVENT_NAME = 'Perspectives On The Apostolic with Thamo Naidoo';
const TARGET_EVENT_DATE = 'Saturday, 15 August 2026';

// Normalize phone number to international format (+267... default for Botswana)
const normalizePhone = (raw?: string | null): string | null => {
  if (!raw) return null;
  let p = String(raw).replace(/[\s\-\(\)]/g, '').trim();
  if (!p) return null;
  if (p.startsWith('+')) return p;
  if (p.startsWith('00')) return '+' + p.slice(2);
  // Botswana local numbers (typically 8 digits starting with 7)
  if (/^[67]\d{7}$/.test(p)) return '+267' + p;
  if (p.startsWith('267')) return '+' + p;
  if (/^\d{10,15}$/.test(p)) return '+' + p;
  return null;
};

const InviteRegistrantsButton = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<{ total: number; emailsSent: number; whatsappSent: number; skipped: number; errors: number } | null>(null);

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

      // Build set of emails already registered for the UPCOMING Aug 15 event
      // (they still receive a reminder, just with a different tone)
      const alreadyRegistered = new Set<string>(
        registrations
          .filter((r: any) =>
            (r.event_name || '').toLowerCase().includes('perspectives on the apostolic') &&
            (r.event_date || '').toLowerCase().includes('15 august 2026')
          )
          .map((r: any) => (r.attendee_email || '').toLowerCase())
      );

      // Get unique recipients (everyone gets a message — invite OR reminder)
      const uniqueRegistrants = new Map<string, any>();
      registrations.forEach(reg => {
        const email = (reg.attendee_email || '').toLowerCase();
        if (!email) return;
        if (!uniqueRegistrants.has(email)) {
          uniqueRegistrants.set(email, reg);
        }
      });

      let emailsSent = 0;
      let whatsappSent = 0;
      let errors = 0;
      let reminders = 0;

      for (const [email, reg] of uniqueRegistrants) {
        const isReminder = alreadyRegistered.has(email);
        if (isReminder) reminders++;

        try {
          await supabase.functions.invoke('send-email', {
            body: {
              type: isReminder ? 'event_reminder' : 'event_invitation',
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
        } catch (emailErr) {
          console.error(`Email failed for ${email}:`, emailErr);
          errors++;
        }

        try {
          const normalizedPhone = normalizePhone(reg.attendee_phone);
          if (normalizedPhone) {
            const message = isReminder
              ? `Hi ${reg.attendee_name}! 🙌\n\nA gentle reminder — you're registered for *Perspectives On The Apostolic* with Thamo Naidoo.\n\n📅 Saturday, 9 May 2026\n⏰ 09:00 – 13:30\n📍 Gate Gaborone, Plot 54014, Gaborone West\n\n🎯 Sessions:\n• Session 1: 09:00–10:15\n• Session 2: 10:45–12:00\n• Session 3: 12:05–13:30\n\nRefreshments provided. Freewill offerings received.\n\nWe look forward to seeing you! 🙌\n\n— Gate Gaborone`
              : `Hi ${reg.attendee_name}! 👋\n\nYou're invited to *Perspectives On The Apostolic* with Thamo Naidoo!\n\n📅 Saturday, 9 May 2026\n⏰ 09:00 – 13:30\n📍 Gate Gaborone, Plot 54014, Gaborone West\n\n🎯 Sessions:\n• Session 1: 09:00–10:15\n• Session 2: 10:45–12:00\n• Session 3: 12:05–13:30\n\nRegistration is compulsory. Register here:\nhttps://www.gategaborone.co.bw/events\n\nIf you have already registered, kindly ignore this message.\n\nRefreshments provided. Freewill offerings received.\n\nWe look forward to seeing you! 🙌\n\n— Gate Gaborone`;

            const waResult = await sendDirectWhatsAppMessage(normalizedPhone, message);
            if (waResult.error) {
              console.error('WhatsApp API error for', normalizedPhone, waResult);
              errors++;
            } else {
              whatsappSent++;
            }
          } else if (reg.attendee_phone) {
            console.log('Skipping invalid phone:', reg.attendee_phone);
          }
        } catch (waErr) {
          console.error('WhatsApp failed for:', reg.attendee_phone, waErr);
          errors++;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResults({ total: uniqueRegistrants.size, emailsSent, whatsappSent, skipped: reminders, errors });
      toast({
        title: 'Invitations Sent!',
        description: `Sent ${emailsSent} emails and ${whatsappSent} WhatsApp messages (${reminders} as reminders to existing registrants).`,
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
          Send email and WhatsApp invitations to all previously registered attendees. Anyone who has already registered for this upcoming event will receive a friendly reminder instead. Automated reminders also go out twice a week (Tuesdays & Fridays).
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold">{results.total}</div>
                <div className="text-xs text-muted-foreground">Recipients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.emailsSent}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Mail className="h-3 w-3" /> Emails</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.whatsappSent}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><MessageCircle className="h-3 w-3" /> WhatsApp</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{results.skipped}</div>
                <div className="text-xs text-muted-foreground">Reminders (Already Registered)</div>
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
