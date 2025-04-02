
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
  name: string;
  email: string;
  phone: string;
  numberOfAttendees: number;
}
