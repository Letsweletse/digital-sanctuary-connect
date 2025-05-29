
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type CheckInStep = 'idle' | 'manual' | 'qr' | 'success';
type CheckInMethod = 'manual' | 'qr';

export const useKioskCheckIn = () => {
  const [currentStep, setCurrentStep] = useState<CheckInStep>('idle');
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [isKioskActive, setIsKioskActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if kiosk mode is active
  useEffect(() => {
    const checkKioskStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('event_config')
          .select('kiosk_mode, active_from, active_until')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching kiosk status:', error);
          setIsKioskActive(false);
        } else if (data) {
          const now = new Date();
          const isActive = data.kiosk_mode && 
            (!data.active_from || new Date(data.active_from) <= now) &&
            (!data.active_until || new Date(data.active_until) >= now);
          setIsKioskActive(isActive);
        }
      } catch (error) {
        console.error('Error checking kiosk status:', error);
        setIsKioskActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkKioskStatus();
    
    // Refresh kiosk status every 30 seconds
    const interval = setInterval(checkKioskStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkIn = async (identifier: string, method: CheckInMethod) => {
    try {
      // Find subscriber by email or phone
      const { data: subscriber, error: findError } = await supabase
        .from('subscribers')
        .select('id, first_name, last_name, email')
        .or(`email.eq.${identifier},phone.eq.${identifier}`)
        .single();

      if (findError || !subscriber) {
        toast({
          title: "Attendee not found",
          description: "Please check your email or phone number and try again.",
          variant: "destructive",
        });
        return false;
      }

      // Create check-in record
      const { error: checkInError } = await supabase
        .from('event_checkins')
        .insert({
          attendee_id: subscriber.id,
          method: method,
          device_id: navigator.userAgent.substring(0, 100), // Simple device fingerprint
        });

      if (checkInError) {
        console.error('Check-in error:', checkInError);
        toast({
          title: "Check-in failed",
          description: "There was an error processing your check-in. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Set attendee name for success message
      const name = subscriber.first_name && subscriber.last_name 
        ? `${subscriber.first_name} ${subscriber.last_name}`
        : subscriber.first_name || subscriber.email;
      
      setAttendeeName(name);
      setCurrentStep('success');
      
      return true;
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Check-in failed",
        description: "There was an error processing your check-in. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetToIdle = () => {
    setCurrentStep('idle');
    setAttendeeName('');
  };

  return {
    currentStep,
    setCurrentStep,
    attendeeName,
    isKioskActive,
    isLoading,
    checkIn,
    resetToIdle
  };
};
