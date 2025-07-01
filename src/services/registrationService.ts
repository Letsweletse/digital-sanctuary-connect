
import { supabase } from '@/integrations/supabase/client';

export interface RegistrationRecord {
  id: string;
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
  created_at: string;
  updated_at: string;
  email_sent?: boolean;
  whatsapp_sent?: boolean;
}

export const registrationService = {
  async getAllRegistrations(): Promise<RegistrationRecord[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }

    return data || [];
  },

  async getRegistrationsByEvent(eventName: string): Promise<RegistrationRecord[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_name', eventName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations by event:', error);
      throw error;
    }

    return data || [];
  },

  async getRegistrations(): Promise<{ success: boolean; data?: RegistrationRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async createRegistration(registration: Omit<RegistrationRecord, 'id' | 'created_at' | 'updated_at'>): Promise<RegistrationRecord> {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([registration])
      .select()
      .single();

    if (error) {
      console.error('Error creating registration:', error);
      throw error;
    }

    return data;
  },

  async saveRegistration(registrationData: any): Promise<{ success: boolean; data?: RegistrationRecord; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{
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
          additional_message: registrationData.message
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving registration:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error saving registration:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async updateRegistration(id: string, updates: Partial<RegistrationRecord>): Promise<RegistrationRecord> {
    const { data, error } = await supabase
      .from('event_registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating registration:', error);
      throw error;
    }

    return data;
  },

  async updateRegistrationStatus(id: string, updates: { email_sent?: boolean; whatsapp_sent?: boolean }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating registration status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating registration status:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};
