
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
  countryCode: string;
  phone: string;
  role: string;
  denomination: string;
  numberOfAttendees: number;
}

export type AttendeeTitle = 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Rev' | 'Pastor' | 'Apostle' | 'Prophet' | 'Bishop';
export type AttendeeRole = 'Pastor' | 'Church Leader' | 'Individual' | 'Ministry Representative' | 'Other';

export const attendeeTitles: AttendeeTitle[] = ['Mr', 'Mrs', 'Ms', 'Dr', 'Rev', 'Pastor', 'Apostle', 'Prophet', 'Bishop'];
export const attendeeRoles: AttendeeRole[] = ['Pastor', 'Church Leader', 'Individual', 'Ministry Representative', 'Other'];

export const countryCodes = [
  { code: '+267', country: 'Botswana' },
  { code: '+27', country: 'South Africa' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
  { code: '+264', country: 'Namibia' },
  { code: '+266', country: 'Lesotho' },
  { code: '+258', country: 'Mozambique' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
];
