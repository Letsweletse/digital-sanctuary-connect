
// Define the category string literals
export type EventCategoryType = 'worship' | 'bible-study' | 'fellowship' | 'outreach' | 'youth' | 'children' | 'conference';

// Define the category object interface
export interface EventCategoryObject {
  id: string;
  name: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: EventCategoryType;
  image: string;
  registration?: boolean;
  registrationLink?: string;
  endDate?: string; // Optional field for multi-day events
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

// Define the registration data interface with check-in properties
export interface RegistrationData {
  event: {
    date: string;
    time: string;
    location: string;
    id: string;
    title: string;
    image: string;
    description: string;
    category: EventCategoryType;
    registration?: boolean;
    registrationLink?: string;
    endDate?: string;
  };
  attendee: {
    title: string;
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    role: string;
    denomination: string;
    numberOfAttendees: number;
    message?: string;
  };
  message: string;
  submitDate: string;
  registrationType: string;
  checkInId?: string;
  checkInUrl?: string;
}

// Add the missing type definitions
export const attendeeTitles = ['Mr', 'Mrs', 'Ms', 'Dr', 'Rev', 'Pastor', 'Bishop', 'Elder', 'Other'];

export const attendeeRoles = [
  'Individual', 
  'Pastor', 
  'Church Leader', 
  'Minister', 
  'Deacon', 
  'Elder', 
  'Youth Leader', 
  'Worship Leader',
  'Church Member',
  'Other'
];

export const countryCodes = [
  { code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+264', country: 'Namibia', flag: '🇳🇦' },
  { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' }
];
