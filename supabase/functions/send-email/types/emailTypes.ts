
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

export interface AdminEmailProps {
  eventName: string;
  registrationType: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  denomination: string;
  message: string;
  checkInId: string;
}

export interface ConfirmationEmailProps {
  title: string;
  name: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventImage: string;
  registrationType: string;
  role: string;
  denomination: string;
  phone: string;
  location: string;
  checkInId: string;
  locationQrCodeUrl: string;
  checkInQrCodeUrl: string;
  encodedIcsContent: string;
  whatsappShareUrl: string;
}

export interface WhatsAppNotificationProps {
  phone: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  checkInId: string;
}
