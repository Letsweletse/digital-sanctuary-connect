
export type EventCategory = 'worship' | 'bible-study' | 'fellowship' | 'outreach' | 'youth' | 'children' | 'conference';

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: EventCategory;
  image: string;
  registration?: boolean;
  registrationLink?: string;
  endDate?: string; // Optional field for multi-day events
}

export interface EventCategory {
  id: string;
  name: string;
}

export interface RegistrationFormData {
  title: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  role: string;
  denomination: string;
  numberOfAttendees: number;
  message?: string;
}
