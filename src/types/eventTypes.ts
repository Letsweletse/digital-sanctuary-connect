
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
  registrationLink?: string;
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

// Updated country codes with flags and more African countries
export const countryCodes = [
  { code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+264', country: 'Namibia', flag: '🇳🇦' },
  { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
  { code: '+265', country: 'Malawi', flag: '🇲🇼' },
  { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '+268', country: 'Eswatini', flag: '🇸🇿' },
  { code: '+244', country: 'Angola', flag: '🇦🇴' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸/🇨🇦' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
];
