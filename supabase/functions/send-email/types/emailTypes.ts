
export interface EmailRequest {
  to: string[];
  subject: string;
  name: string;
  email: string;
  message: string;
  eventName: string;
  registrationType: string;
  sendConfirmation: boolean;
  title: string;
  role: string;
  denomination: string;
  phone: string;
  location: string;
  eventDate?: string;
  eventTime?: string;
  eventImage?: string;
  checkInId?: string;
  attendeeEmail?: string;
}
