
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, Mail, MessageCircle, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const EVENT_NAME = 'Perspectives On The Apostolic with Thamo Naidoo';
const NEW_EVENT_DATE = 'Saturday, 24 October 2026';
const OLD_EVENT_DATE = 'Saturday, 15 August 2026';
const EVENT_TIME = '09:00 - 13:30';
const EVENT_LOCATION = 'Gate Gaborone, Plot 54014, Gaborone West';

// Normalize phone number to international format (+267... default for Botswana)
const normalizePhone = (raw?: string | null): string | null => {
  if (!raw) return null;
  let p = String(raw).replace(/[\s\-\(\)]/g, '').trim();
  if (!p) return null;
  if (p.startsWith('+')) return p;
  if (p.startsWith('00')) return '+' + p.slice(2);
  if (/^[67]\d{7}$/.test(p)) return '+267' + p;
  if (p.startsWith('267')) return '+' + p;
  if (/^\d{10,15}$/.test(p)) return '+' + p;
  return null;
};

const sessionsBlock = `🎯 Sessions:\n• Session 1: 09:00–10:15\n• Session 2: 10:45–12:00\n• Session 3: 12:05–13:30`;

const postponementMessage = (name: string) =>
  `Dear ${name},\n\n*IMPORTANT NOTICE — EVENT POSTPONED*\n\nThe *Perspectives On The Apostolic* gathering scheduled for ${OLD_EVENT_DATE} has been *cancelled*.\n\nThere has been an unfortunate death in the Gate Global family and Apostle Thamo Naidoo has to attend the funeral. We sincerely apologise for the inconvenience.\n\n✅ *NEW DATE:*\n📅 ${NEW_EVENT_DATE}\n⏰ ${EVENT_TIME}\n📍 ${EVENT_LOCATION}\n\n${sessionsBlock}\n\nRegistration is compulsory. Please register for the new date here:\nhttps://www.gategaborone.co.bw/event\n\nRefreshments provided. Freewill offerings received.\n\nThank you for your understanding. 🙏\n\n— Gate Gaborone`;

const invitationMessage = (name: string, isReminder: boolean) =>
  isReminder
    ? `Hi ${name}! 🙌\n\nA gentle reminder — you're registered for *Perspectives On The Apostolic* with Thamo Naidoo.\n\n📅 ${NEW_EVENT_DATE}\n⏰ ${EVENT_TIME}\n📍 ${EVENT_LOCATION}\n\n${sessionsBlock}\n\nRefreshments provided. Freewill offerings received.\n\nWe look forward to seeing you! 🙌\n\n— Gate Gaborone`
    : `Hi ${name}! 👋\n\nYou're invited to *Perspectives On The Apostolic* with Thamo Naidoo!\n\n📅 ${NEW_EVENT_DATE}\n⏰ ${EVENT_TIME}\n📍 ${EVENT_LOCATION}\n\n${sessionsBlock}\n\nRegistration is compulsory. Register here:\nhttps://www.gategaborone.co.bw/event\n\nIf you have already registered for this October event, kindly ignore this message.\n\nRefreshments provided. Freewill offerings received.\n\nWe look forward to seeing you! 🙌\n\n— Gate Gaborone`;

interface Results { total: number; emailsSent: number; whatsappSent: number; reminders: number; errors: number }
interface SendProgress extends Results { processed: number }

const InviteRegistrantsButton = () => {
  const { toast } = useToast();
  const [sendingMode, setSendingMode] = useState<null | 'postponement' | 'invitation'>(null);
  const [results, setResults] = useState<(Results & { mode: string }) | null>(null);
  const [progress, setProgress] = useState<SendProgress | null>(null);

  const runSend = async (mode: 'postponement' | 'invitation') => {
    setSendingMode(mode);
    setResults(null);
    setProgress(null);
    toast({
      title: 'Sending started',
      description: 'Please keep this tab open. Live delivery progress will appear below.',
    });

    try {
      const { data: registrations, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!registrations || registrations.length === 0) {
        toast({ title: 'No Registrants', description: 'No registrations found.', variant: 'destructive' });
        setSendingMode(null);
        return;
      }

      // Already registered for the NEW October date
      const alreadyRegistered = new Set<string>(
        registrations
          .filter((r: any) =>
            (r.event_name || '').toLowerCase().includes('perspectives on the apostolic') &&
            (r.event_date || '').toLowerCase().includes('24 october 2026')
          )
          .map((r: any) => (r.attendee_email || '').toLowerCase())
      );

      const uniqueRegistrants = new Map<string, any>();
      registrations.forEach((reg: any) => {
        const email = (reg.attendee_email || '').toLowerCase();
        if (!email) return;
        if (!uniqueRegistrants.has(email)) uniqueRegistrants.set(email, reg);
      });

      let emailsSent = 0;
      let whatsappSent = 0;
      let errors = 0;
      let reminders = 0;
      let processed = 0;
      setProgress({ total: uniqueRegistrants.size, processed, emailsSent, whatsappSent, reminders, errors });

      for (const [email, reg] of uniqueRegistrants) {
        const isReminder = mode === 'invitation' && alreadyRegistered.has(email);
        if (isReminder) reminders++;

        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
            body: {
              type: mode === 'postponement' ? 'event_postponement' : (isReminder ? 'event_reminder' : 'event_invitation'),
              recipientName: reg.attendee_name,
              recipientEmail: email,
              recipientPhone: reg.attendee_phone,
              eventName: EVENT_NAME,
              eventDate: NEW_EVENT_DATE,
              oldEventDate: OLD_EVENT_DATE,
              eventTime: EVENT_TIME,
              eventLocation: EVENT_LOCATION,
            }
          });
          if (emailError || emailData?.error) {
            throw emailError || new Error(emailData.error);
          }
          emailsSent++;
        } catch (emailErr) {
          console.error(`Email failed for ${email}:`, emailErr);
          errors++;
        }

        try {
          const normalizedPhone = normalizePhone(reg.attendee_phone);
          if (normalizedPhone) {
            const message = mode === 'postponement'
              ? postponementMessage(reg.attendee_name)
              : invitationMessage(reg.attendee_name, isReminder);

            const { data: waData, error: waError } = await supabase.functions.invoke('send-whatsapp', {
              body: { phone: normalizedPhone, message },
            });
            if (waError || waData?.error || !waData?.success) {
              throw waError || new Error(waData?.message || 'WhatsApp provider rejected the message');
            }
            whatsappSent++;
          } else {
            console.warn('WhatsApp skipped because the phone number is invalid:', reg.attendee_phone);
            errors++;
          }
        } catch (waErr) {
          console.error('WhatsApp failed for:', reg.attendee_phone, waErr);
          errors++;
        }

        processed++;
        setProgress({ total: uniqueRegistrants.size, processed, emailsSent, whatsappSent, reminders, errors });
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setResults({ mode, total: uniqueRegistrants.size, emailsSent, whatsappSent, reminders, errors });
      toast({
        title: mode === 'postponement' ? 'Postponement Notices Sent!' : 'Invitations Sent!',
        description: `Sent ${emailsSent} emails and ${whatsappSent} WhatsApp messages.`,
      });
    } catch (err) {
      console.error('Error sending messages:', err);
      toast({ title: 'Error', description: 'Failed to send messages.', variant: 'destructive' });
    } finally {
      setSendingMode(null);
      setProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-amber-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Send Postponement Notice – 15 August Cancelled
          </CardTitle>
          <CardDescription>
            Notify everyone in the database (email + WhatsApp) that the 15 August gathering is cancelled due to a bereavement in the Gate Global family, and that the next Perspectives On The Apostolic is on 24 October 2026.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-amber-900">Message summary:</p>
            <p className="text-sm text-amber-800">❌ Cancelled: {OLD_EVENT_DATE}</p>
            <p className="text-sm text-amber-800">🙏 Reason: Funeral in the Gate Global family (Apostle Thamo Naidoo attending)</p>
            <p className="text-sm text-amber-800">✅ New date: {NEW_EVENT_DATE}, {EVENT_TIME}</p>
            <p className="text-sm text-amber-800">📍 {EVENT_LOCATION}</p>
          </div>

          <Button
            onClick={() => runSend('postponement')}
            disabled={sendingMode !== null}
            size="lg"
            variant="destructive"
            className="w-full"
          >
            {sendingMode === 'postponement' ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending Postponement Notices...</>
            ) : (
              <><AlertTriangle className="h-4 w-4 mr-2" /> Send Postponement Notice to Everyone</>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-500" />
            Send Invitations – Perspectives On The Apostolic (24 October 2026)
          </CardTitle>
          <CardDescription>
            Send email and WhatsApp invitations for the new October date. Anyone already registered for 24 October receives a friendly reminder instead.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-blue-900">Event Details:</p>
            <p className="text-sm text-blue-800">📅 {NEW_EVENT_DATE}</p>
            <p className="text-sm text-blue-800">⏰ {EVENT_TIME} (3 Sessions)</p>
            <p className="text-sm text-blue-800">📍 {EVENT_LOCATION}</p>
            <p className="text-sm text-blue-800">🎤 Speaker: Thamo Naidoo</p>
          </div>

          <Button
            onClick={() => runSend('invitation')}
            disabled={sendingMode !== null}
            size="lg"
            className="w-full"
          >
            {sendingMode === 'invitation' ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending Invitations...</>
            ) : (
              <><Users className="h-4 w-4 mr-2" /> Send Invitations to All Registrants</>
            )}
          </Button>
        </CardContent>
      </Card>

      {sendingMode && progress && (
        <div className="border border-border bg-card rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending email and WhatsApp notifications
            </div>
            <span className="text-sm text-muted-foreground">{progress.processed} / {progress.total}</span>
          </div>
          <Progress value={progress.total ? (progress.processed / progress.total) * 100 : 0} />
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div><strong className="block text-blue-600">{progress.emailsSent}</strong>Emails sent</div>
            <div><strong className="block text-green-600">{progress.whatsappSent}</strong>WhatsApp sent</div>
            <div><strong className="block text-red-600">{progress.errors}</strong>Failed/skipped</div>
          </div>
          <p className="text-xs text-muted-foreground">Keep this tab open until sending is complete.</p>
        </div>
      )}

      {results && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <CheckCircle className="h-5 w-5" /> {results.mode === 'postponement' ? 'Postponement' : 'Invitation'} Results
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
              <div className="text-2xl font-bold text-amber-600">{results.reminders}</div>
              <div className="text-xs text-muted-foreground">Reminders (Already Registered)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{results.errors}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteRegistrantsButton;
