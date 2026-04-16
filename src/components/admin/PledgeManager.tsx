
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Download, Copy, Heart, Mail, MessageCircle } from 'lucide-react';

interface Pledge {
  id: string;
  pledger_name: string;
  pledger_email: string;
  pledger_phone: string | null;
  event_name: string;
  pledge_amount: number;
  currency: string;
  message: string | null;
  email_sent: boolean;
  whatsapp_sent: boolean;
  created_at: string;
}

const PledgeManager = () => {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const pledgeUrl = `${window.location.origin}/pledge`;

  const fetchPledges = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pledges' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPledges((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching pledges:', error);
      toast({ title: 'Error', description: 'Failed to fetch pledges', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPledges(); }, []);

  const totalByCurrency = pledges.reduce((acc, p) => {
    acc[p.currency] = (acc[p.currency] || 0) + Number(p.pledge_amount);
    return acc;
  }, {} as Record<string, number>);

  const copyLink = () => {
    navigator.clipboard.writeText(pledgeUrl);
    toast({ title: 'Link Copied!', description: 'Pledge link copied to clipboard.' });
  };

  const shareWhatsApp = () => {
    const text = `🙏 Support the Apostolic Conference – Malawi 2026!\n\nTheme: Time to Build (Haggai 1:2)\n📅 29 April – 2 May 2026\n📍 Capital City Baptist Hall, Lilongwe\n\nMake your pledge here: ${pledgeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const exportCSV = () => {
    if (pledges.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Amount', 'Currency', 'Message', 'Date'];
    const csv = [
      headers.join(','),
      ...pledges.map(p => [
        `"${p.pledger_name}"`, `"${p.pledger_email}"`, `"${p.pledger_phone || ''}"`,
        p.pledge_amount, p.currency, `"${p.message || ''}"`,
        `"${new Date(p.created_at).toLocaleString()}"`
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pledges-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: `Exported ${pledges.length} pledges to CSV.` });
  };

  const handleResendEmail = async (pledge: Pledge) => {
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'pledge_confirmation',
          pledgerName: pledge.pledger_name,
          pledgerEmail: pledge.pledger_email,
          pledgerPhone: pledge.pledger_phone,
          pledgeAmount: String(pledge.pledge_amount),
          currency: pledge.currency,
          message: pledge.message,
          eventName: pledge.event_name,
        }
      });
      toast({ title: 'Email Sent', description: `Confirmation resent to ${pledge.pledger_email}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send email', variant: 'destructive' });
    }
  };

  const handleResendWhatsApp = async (pledge: Pledge) => {
    if (!pledge.pledger_phone) return;
    try {
      await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: pledge.pledger_phone,
          message: `Thank you ${pledge.pledger_name}! 🙏\n\nYour pledge of *${pledge.currency} ${pledge.pledge_amount}* for the *Apostolic Conference - Malawi 2026* has been received.\n\nGod bless you! 🙌\n\n— Gate Gaborone`
        }
      });
      toast({ title: 'WhatsApp Sent', description: `Message sent to ${pledge.pledger_phone}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send WhatsApp', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Shareable Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Pledge Link – Apostolic Conference Malawi 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Share this link with people to collect pledges for the conference.</p>
          <div className="flex gap-2">
            <Input value={pledgeUrl} readOnly className="flex-1" />
            <Button onClick={copyLink} variant="outline" size="sm"><Copy className="h-4 w-4 mr-1" /> Copy</Button>
            <Button onClick={shareWhatsApp} variant="outline" size="sm" className="bg-green-50 text-green-700 hover:bg-green-100">
              <MessageCircle className="h-4 w-4 mr-1" /> Share via WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pledges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pledges.length}</div>
          </CardContent>
        </Card>
        {Object.entries(totalByurrency).length > 0 ? (
          Object.entries(totalByurrency).map(([currency, total]) => (
            <Card key={currency}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total ({currency})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">All Pledges</h2>
        <div className="flex gap-2">
          <Button onClick={fetchPledges} variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
          <Button onClick={exportCSV} variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        </div>
      </div>

      {/* Pledges List */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8"><RefreshCw className="animate-spin h-6 w-6 mr-2" /> Loading...</div>
          ) : pledges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No pledges yet. Share the pledge link to start collecting pledges.</div>
          ) : (
            <div className="space-y-4">
              {pledges.map((pledge) => (
                <div key={pledge.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{pledge.pledger_name}</h3>
                      <p className="text-sm text-muted-foreground">{pledge.pledger_email}</p>
                      {pledge.pledger_phone && <p className="text-sm text-muted-foreground">{pledge.pledger_phone}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {pledge.currency} {Number(pledge.pledge_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleResendEmail(pledge)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      {pledge.pledger_phone && (
                        <Button variant="ghost" size="sm" onClick={() => handleResendWhatsApp(pledge)}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {pledge.message && <p className="text-sm text-muted-foreground italic">"{pledge.message}"</p>}
                  <p className="text-xs text-muted-foreground mt-2">Pledged: {new Date(pledge.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Fix variable name typo
const totalByurrency = {} as Record<string, number>;

export default PledgeManager;
