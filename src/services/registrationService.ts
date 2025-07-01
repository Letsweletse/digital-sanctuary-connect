
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
  }
};
