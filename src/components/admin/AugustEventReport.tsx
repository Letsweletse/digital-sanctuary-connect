import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserCheck, UserX, Download, RefreshCw, Loader2 } from 'lucide-react';

const OCT_DATE_MATCH = '24 october 2026';
const EVENT_NAME_MATCH = 'perspectives on the apostolic';

interface Reg {
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string | null;
  attendee_role: string | null;
  attendee_denomination: string | null;
  number_of_attendees: number | null;
  created_at: string;
  event_name: string;
  event_date: string;
}

const AugustEventReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [octRegs, setOctRegs] = useState<Reg[]>([]);
  const [pastUnique, setPastUnique] = useState<Set<string>>(new Set());

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('attendee_name, attendee_email, attendee_phone, attendee_role, attendee_denomination, number_of_attendees, created_at, event_name, event_date')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    const all = (data || []) as Reg[];
    const oct = all.filter(r =>
      (r.event_name || '').toLowerCase().includes(EVENT_NAME_MATCH) &&
      (r.event_date || '').toLowerCase().includes(OCT_DATE_MATCH)
    );
    const past = new Set<string>();
    all.forEach(r => {
      const isOct = (r.event_date || '').toLowerCase().includes(OCT_DATE_MATCH);
      if (!isAug && r.attendee_email) past.add(r.attendee_email.toLowerCase());
    });
    setOctRegs(oct);
    setPastUnique(past);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const octEmails = new Set(octRegs.map(r => (r.attendee_email || '').toLowerCase()));
  const notYetRegistered = Array.from(pastUnique).filter(e => !octEmails.has(e));
  const totalAttendees = octRegs.reduce((sum, r) => sum + (r.number_of_attendees && r.number_of_attendees < 1000 ? r.number_of_attendees : 1), 0);

  const downloadCsv = (rows: Reg[], filename: string) => {
    const headers = ['Name','Email','Phone','Role','Denomination','Attendees','Registered At'];
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...rows.map(r => [r.attendee_name, r.attendee_email, r.attendee_phone, r.attendee_role, r.attendee_denomination, r.number_of_attendees, r.created_at].map(escape).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          October 24, 2026 Event Report
          <Badge variant="secondary">Perspectives On The Apostolic</Badge>
        </CardTitle>
        <CardDescription>
          Separate tracking for the 24 October 2026 event only — independent from previous (May / August) registrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                <UserCheck className="h-5 w-5 mx-auto text-green-700 mb-1" />
                <div className="text-3xl font-bold text-green-700">{octRegs.length}</div>
                <div className="text-xs text-muted-foreground">Registrations (Aug 15)</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <Users className="h-5 w-5 mx-auto text-blue-700 mb-1" />
                <div className="text-3xl font-bold text-blue-700">{totalAttendees}</div>
                <div className="text-xs text-muted-foreground">Total Attendees</div>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <Users className="h-5 w-5 mx-auto text-amber-700 mb-1" />
                <div className="text-3xl font-bold text-amber-700">{pastUnique.size}</div>
                <div className="text-xs text-muted-foreground">Past Unique Contacts</div>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
                <UserX className="h-5 w-5 mx-auto text-red-700 mb-1" />
                <div className="text-3xl font-bold text-red-700">{notYetRegistered.length}</div>
                <div className="text-xs text-muted-foreground">Not Yet Registered</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={load}>
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadCsv(octRegs, `Aug15_Registered_${new Date().toISOString().slice(0,10)}.csv`)}>
                <Download className="h-4 w-4 mr-1" /> Download Registered ({octRegs.length})
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 font-semibold text-sm">Registered for October 24</div>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-2">Name</th>
                      <th className="text-left px-3 py-2">Email</th>
                      <th className="text-left px-3 py-2">Phone</th>
                      <th className="text-left px-3 py-2">Attendees</th>
                      <th className="text-left px-3 py-2">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {octRegs.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{r.attendee_name}</td>
                        <td className="px-3 py-2">{r.attendee_email}</td>
                        <td className="px-3 py-2">{r.attendee_phone || '—'}</td>
                        <td className="px-3 py-2">{r.number_of_attendees ?? 1}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {octRegs.length === 0 && (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">No registrations yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AugustEventReport;
