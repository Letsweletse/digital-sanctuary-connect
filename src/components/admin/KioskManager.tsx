
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Monitor, Users, Calendar, Clock } from 'lucide-react';

interface EventConfig {
  id: string;
  kiosk_mode: boolean;
  event_name: string;
  active_from: string;
  active_until: string;
}

const KioskManager = () => {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [checkInCount, setCheckInCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchEventConfig();
    fetchCheckInCount();
  }, []);

  const fetchEventConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching event config:', error);
      toast({
        title: "Error",
        description: "Failed to load kiosk configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCheckInCount = async () => {
    try {
      const { count, error } = await supabase
        .from('event_checkins')
        .select('*', { count: 'exact', head: true })
        .gte('checkin_time', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      if (error) throw error;
      setCheckInCount(count || 0);
    } catch (error) {
      console.error('Error fetching check-in count:', error);
    }
  };

  const handleToggleKiosk = async (enabled: boolean) => {
    if (!config) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('event_config')
        .update({ kiosk_mode: enabled })
        .eq('id', config.id);

      if (error) throw error;

      setConfig({ ...config, kiosk_mode: enabled });
      toast({
        title: "Success",
        description: `Kiosk mode ${enabled ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating kiosk mode:', error);
      toast({
        title: "Error",
        description: "Failed to update kiosk mode.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('event_config')
        .update({
          event_name: config.event_name,
          active_from: config.active_from,
          active_until: config.active_until,
        })
        .eq('id', config.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event configuration updated successfully.",
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update event configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-church-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Monitor className="h-8 w-8 text-church-blue" />
        <h2 className="text-3xl font-bold text-church-neutral-900">
          Kiosk Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-church-neutral-600">
              Kiosk Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${config?.kiosk_mode ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-2xl font-bold">
                {config?.kiosk_mode ? 'Active' : 'Inactive'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-church-neutral-600">
              Today's Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-church-blue" />
              <span className="text-2xl font-bold">{checkInCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-church-neutral-600">
              Kiosk URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              /kiosk-checkin
            </code>
          </CardContent>
        </Card>
      </div>

      {config && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Kiosk Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="kiosk-toggle" className="text-base font-medium">
                    Enable Kiosk Mode
                  </Label>
                  <p className="text-sm text-church-neutral-600">
                    Allow attendees to check in at the kiosk
                  </p>
                </div>
                <Switch
                  id="kiosk-toggle"
                  checked={config.kiosk_mode}
                  onCheckedChange={handleToggleKiosk}
                  disabled={isSaving}
                />
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => window.open('/kiosk-checkin', '_blank')}
                  className="w-full bg-church-blue hover:bg-church-blue-dark"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Open Kiosk Screen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateConfig} className="space-y-4">
                <div>
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    value={config.event_name}
                    onChange={(e) => setConfig({ ...config, event_name: e.target.value })}
                    placeholder="Event name"
                  />
                </div>

                <div>
                  <Label htmlFor="active-from">Active From</Label>
                  <Input
                    id="active-from"
                    type="datetime-local"
                    value={config.active_from ? new Date(config.active_from).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setConfig({ ...config, active_from: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="active-until">Active Until</Label>
                  <Input
                    id="active-until"
                    type="datetime-local"
                    value={config.active_until ? new Date(config.active_until).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setConfig({ ...config, active_until: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Saving...' : 'Update Configuration'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KioskManager;
