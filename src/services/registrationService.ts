
import { supabase } from "@/integrations/supabase/client";
import { RegistrationData } from '@/types/eventTypes';

export interface RegistrationRecord {
  id?: string;
  event_name: string;
  event_date: string;
  event_time?: string;
  event_location?: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone?: string;
  attendee_title?: string;
  attendee_role?: string;
  attendee_denomination?: string;
  number_of_attendees?: number;
  registration_type?: string;
  check_in_id?: string;
  check_in_url?: string;
  additional_message?: string;
  email_sent?: boolean;
  whatsapp_sent?: boolean;
}

export const registrationService = {
  // Save registration to database
  async saveRegistration(registrationData: RegistrationData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log('💾 Saving registration to database:', registrationData);
      
      const registrationRecord: RegistrationRecord = {
        event_name: registrationData.event.title,
        event_date: registrationData.event.date,
        event_time: registrationData.event.time,
        event_location: registrationData.event.location,
        attendee_name: registrationData.attendee.name,
        attendee_email: registrationData.attendee.email,
        attendee_phone: registrationData.attendee.phone,
        attendee_title: registrationData.attendee.title,
        attendee_role: registrationData.attendee.role,
        attendee_denomination: registrationData.attendee.denomination,
        number_of_attendees: registrationData.attendee.numberOfAttendees,
        registration_type: registrationData.registrationType,
        check_in_id: registrationData.checkInId,
        check_in_url: registrationData.checkInUrl,
        additional_message: registrationData.message,
        email_sent: false,
        whatsapp_sent: false
      };

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([registrationRecord])
        .select()
        .single();

      if (error) {
        console.error('❌ Database save failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Registration saved successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Exception saving registration:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Get all registrations
  async getRegistrations(): Promise<{ success: boolean; data?: RegistrationRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch registrations:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Exception fetching registrations:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Update registration status
  async updateRegistrationStatus(id: string, updates: Partial<RegistrationRecord>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('❌ Failed to update registration:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Exception updating registration:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};
