
export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image: string;
  registration?: boolean;
}

export interface EventCategory {
  id: string;
  name: string;
}

export interface RegistrationFormData {
  title: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  denomination: string;
  numberOfAttendees: number;
}

export type AttendeeTitle = 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Rev' | 'Pastor';
export type AttendeeRole = 'Pastor' | 'Church Leader' | 'Individual' | 'Ministry Representative' | 'Other';

export const attendeeTitles: AttendeeTitle[] = ['Mr', 'Mrs', 'Ms', 'Dr', 'Rev', 'Pastor'];
export const attendeeRoles: AttendeeRole[] = ['Pastor', 'Church Leader', 'Individual', 'Ministry Representative', 'Other'];
