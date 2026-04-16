
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, CheckCircle } from 'lucide-react';

const currencies = [
  { code: 'BWP', label: 'BWP (Pula)' },
  { code: 'ZAR', label: 'ZAR (Rand)' },
  { code: 'MWK', label: 'MWK (Kwacha)' },
  { code: 'USD', label: 'USD (Dollar)' },
  { code: 'GBP', label: 'GBP (Pound)' },
];

const Pledge = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    pledger_name: '',
    pledger_email: '',
    pledger_phone: '',
    pledge_amount: '',
    currency: 'BWP',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pledger_name || !form.pledger_email || !form.pledge_amount) {
      toast({ title: 'Missing fields', description: 'Please fill in name, email and pledge amount.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save pledge to database
      const { error } = await supabase.from('pledges' as any).insert([{
        pledger_name: form.pledger_name,
        pledger_email: form.pledger_email,
        pledger_phone: form.pledger_phone || null,
        pledge_amount: parseFloat(form.pledge_amount),
        currency: form.currency,
        message: form.message || null,
        event_name: 'Apostolic Conference - Malawi 2026',
      }]);

      if (error) throw error;

      // Send notifications via edge function
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'pledge_confirmation',
          pledgerName: form.pledger_name,
          pledgerEmail: form.pledger_email,
          pledgerPhone: form.pledger_phone,
          pledgeAmount: form.pledge_amount,
          currency: form.currency,
          message: form.message,
          eventName: 'Apostolic Conference - Malawi 2026',
        }
      });

      // Send WhatsApp if phone provided
      if (form.pledger_phone) {
        await supabase.functions.invoke('send-whatsapp', {
          body: {
            phone: form.pledger_phone,
            message: `Thank you ${form.pledger_name}! 🙏\n\nYour pledge of *${form.currency} ${form.pledge_amount}* for the *Apostolic Conference - Malawi 2026* has been received.\n\n📅 Dates: 29th April – 2nd May 2026\n⏰ Time: 9:00 AM – 3:30 PM\n📍 Venue: Capital City Baptist Hall, Lilongwe, Malawi\n\nTheme: Time to Build (Haggai 1:2)\n\nGuest Speakers:\n• Randolph Barnwell (South Africa)\n• Kobus Bezuidenhout (Botswana)\n\nGod bless you for your generous contribution! 🙌\n\n— Gate Gaborone`
          }
        });
      }

      setSubmitted(true);
      toast({ title: 'Pledge Submitted!', description: 'Thank you for your generous pledge.' });
    } catch (error) {
      console.error('Pledge error:', error);
      toast({ title: 'Error', description: 'Failed to submit pledge. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <main className="flex-grow pt-24 page-transition">
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-2xl">
              <Card className="text-center">
                <CardContent className="pt-10 pb-10 space-y-6">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                  <h1 className="text-3xl font-bold text-foreground">Thank You for Your Pledge!</h1>
                  <p className="text-lg text-muted-foreground">
                    Your pledge of <strong>{form.currency} {form.pledge_amount}</strong> for the <strong>Apostolic Conference - Malawi 2026</strong> has been received.
                  </p>
                  <div className="bg-muted/50 p-6 rounded-lg text-left space-y-2">
                    <p><strong>Event:</strong> Apostolic Conference - Malawi 2026</p>
                    <p><strong>Theme:</strong> Time to Build (Haggai 1:2)</p>
                    <p><strong>Dates:</strong> 29th April – 2nd May 2026</p>
                    <p><strong>Time:</strong> 9:00 AM – 3:30 PM</p>
                    <p><strong>Venue:</strong> Capital City Baptist Hall, Lilongwe, Malawi</p>
                    <p><strong>Guest Speakers:</strong> Randolph Barnwell (South Africa), Kobus Bezuidenhout (Botswana)</p>
                  </div>
                  <p className="text-muted-foreground">A confirmation has been sent to your email{form.pledger_phone ? ' and WhatsApp' : ''}.</p>
                  <Button onClick={() => { setSubmitted(false); setForm({ pledger_name: '', pledger_email: '', pledger_phone: '', pledge_amount: '', currency: 'BWP', message: '' }); }}>
                    Make Another Pledge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow pt-24 page-transition">
        <section className="bg-gradient-to-b from-amber-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-amber-100 px-3 py-1 rounded-full text-sm font-medium text-amber-800 mb-4">
                Support the Conference
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Apostolic Conference – Malawi 2026
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Theme: <strong>Time to Build</strong> (Haggai 1:2)
              </p>
              <p className="text-muted-foreground">
                29th April – 2nd May 2026 · Capital City Baptist Hall, Lilongwe, Malawi
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Info */}
              <div className="space-y-6">
                <img 
                  src="/images/events/apostolic-conference-malawi-2026.png" 
                  alt="Apostolic Conference Malawi 2026" 
                  className="w-full rounded-xl shadow-lg"
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Conference Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>📅 Dates:</strong> 29th April – 2nd May 2026</p>
                    <p><strong>⏰ Time:</strong> 9:00 AM – 3:30 PM</p>
                    <p><strong>📍 Venue:</strong> Capital City Baptist Hall, Lilongwe, Malawi</p>
                    <p><strong>🍽️</strong> Lunch will be provided</p>
                    <hr />
                    <p><strong>Guest Speakers:</strong></p>
                    <p>• Randolph Barnwell – South Africa</p>
                    <p>• Kobus Bezuidenhout – Botswana</p>
                    <hr />
                    <p><strong>To register:</strong></p>
                    <p>Getrude: 0993181830</p>
                    <p>Chris: 0993749297</p>
                  </CardContent>
                </Card>
              </div>

              {/* Pledge Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Make a Pledge
                  </CardTitle>
                  <CardDescription>
                    Pledge your contribution towards the Apostolic Conference in Malawi.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="pledger_name">Full Name *</Label>
                      <Input id="pledger_name" value={form.pledger_name} onChange={e => handleChange('pledger_name', e.target.value)} placeholder="Your full name" required />
                    </div>
                    <div>
                      <Label htmlFor="pledger_email">Email Address *</Label>
                      <Input id="pledger_email" type="email" value={form.pledger_email} onChange={e => handleChange('pledger_email', e.target.value)} placeholder="your@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="pledger_phone">Phone / WhatsApp (optional)</Label>
                      <Input id="pledger_phone" value={form.pledger_phone} onChange={e => handleChange('pledger_phone', e.target.value)} placeholder="+265 999 000 000" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Currency</Label>
                        <Select value={form.currency} onValueChange={v => handleChange('currency', v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {currencies.map(c => (
                              <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pledge_amount">Amount *</Label>
                        <Input id="pledge_amount" type="number" min="1" step="0.01" value={form.pledge_amount} onChange={e => handleChange('pledge_amount', e.target.value)} placeholder="0.00" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message">Message (optional)</Label>
                      <Textarea id="message" value={form.message} onChange={e => handleChange('message', e.target.value)} placeholder="Any message or note..." rows={3} />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting Pledge...' : '🙏 Submit Pledge'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Pledge;
