
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, MessageCircle, Calendar, Users, RefreshCw } from 'lucide-react';
import { registrationService, RegistrationRecord } from '@/services/registrationService';
import { useToast } from '@/hooks/use-toast';

const RegistrationManager = () => {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const result = await registrationService.getRegistrations();
      if (result.success && result.data) {
        setRegistrations(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch registrations",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast({
        title: "Error",
        description: "An error occurred while fetching registrations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const exportToCSV = () => {
    if (registrations.length === 0) {
      toast({
        title: "No Data",
        description: "No registrations to export",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Name', 'Email', 'Phone', 'Event', 'Date', 'Role', 'Denomination', 
      'Attendees', 'Registration Date', 'Email Sent', 'WhatsApp Sent'
    ];

    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.attendee_name || ''}"`,
        `"${reg.attendee_email || ''}"`,
        `"${reg.attendee_phone || ''}"`,
        `"${reg.event_name || ''}"`,
        `"${reg.event_date || ''}"`,
        `"${reg.attendee_role || ''}"`,
        `"${reg.attendee_denomination || ''}"`,
        reg.number_of_attendees || 0,
        `"${new Date(reg.created_at || '').toLocaleDateString()}"`,
        reg.email_sent ? 'Yes' : 'No',
        reg.whatsapp_sent ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${registrations.length} registrations to CSV`
    });
  };

  const getEventStats = () => {
    const eventCounts = registrations.reduce((acc, reg) => {
      acc[reg.event_name] = (acc[reg.event_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalAttendees = registrations.reduce((sum, reg) => 
      sum + (reg.number_of_attendees || 1), 0);

    return { eventCounts, totalAttendees };
  };

  const { eventCounts, totalAttendees } = getEventStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin h-8 w-8 mr-2" />
        <span>Loading registrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(eventCounts).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Registrations</h2>
        <div className="flex gap-2">
          <Button onClick={fetchRegistrations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Event Breakdown */}
      {Object.keys(eventCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registrations by Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(eventCounts).map(([eventName, count]) => (
                <div key={eventName} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">{eventName}</div>
                  <div className="text-2xl font-bold text-church-blue">{count}</div>
                  <div className="text-xs text-muted-foreground">registrations</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No registrations found. Registrations will appear here once people start registering for events.
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.slice(0, 50).map((registration) => (
                <div key={registration.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{registration.attendee_name}</h3>
                      <p className="text-sm text-muted-foreground">{registration.attendee_email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={registration.email_sent ? "default" : "secondary"}>
                        <Mail className="h-3 w-3 mr-1" />
                        {registration.email_sent ? "Email Sent" : "Email Pending"}
                      </Badge>
                      <Badge variant={registration.whatsapp_sent ? "default" : "secondary"}>
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {registration.whatsapp_sent ? "WhatsApp Sent" : "WhatsApp Pending"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Event:</span>
                      <p className="text-muted-foreground">{registration.event_name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <p className="text-muted-foreground">{registration.event_date}</p>
                    </div>
                    <div>
                      <span className="font-medium">Role:</span>
                      <p className="text-muted-foreground">{registration.attendee_role}</p>
                    </div>
                    <div>
                      <span className="font-medium">Attendees:</span>
                      <p className="text-muted-foreground">{registration.number_of_attendees}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    Registered: {new Date(registration.created_at || '').toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationManager;
