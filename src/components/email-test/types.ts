
import { ADMIN_EMAILS } from '@/lib/emailService';

// Define the email test form data type
export interface EmailTestFormData {
  to: string;
  subject: string;
  name: string;
  email: string;
  message: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  sendConfirmation: boolean;
  title: string;
  role: string;
  denomination: string;
  phone: string;
}

// Define API response types
export interface EmailSuccessResponse {
  success: true;
  message: string;
  recipients: string[];
  timestamp: string;
  data: any;
  error?: never;
}

export interface EmailErrorResponse {
  success: false;
  message: string;
  error?: string;
  recipients?: undefined;
  timestamp?: undefined;
  data?: undefined;
}

export type EmailResponse = EmailSuccessResponse | EmailErrorResponse;

export interface EmailStatus {
  isSending: boolean;
  isSuccess: boolean | null;
  adminEmailSent: boolean | null;
  confirmationEmailSent: boolean | null;
  whatsappSent: boolean | null;
  whatsappLink: string | null;
  resendKeyConfigured: boolean | null;
  message: string | null;
  error: string | null;
  lastSentTo: string | null;
}

// Default form data
export const defaultFormData: EmailTestFormData = {
  to: ADMIN_EMAILS.join(','),
  subject: 'Test Email from Gate Gaborone',
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message from the email test form.',
  eventName: 'Testing Event',
  eventDate: '2025-04-15',
  eventTime: '10:00 AM - 12:00 PM',
  location: 'Gate Gaborone Church, Block 10, Gaborone, Botswana',
  sendConfirmation: true,
  title: 'Mr',
  role: 'Member',
  denomination: 'Non-denominational',
  phone: '+267 71000000'
};

// Initial status
export const initialStatus: EmailStatus = {
  isSending: false,
  isSuccess: null,
  adminEmailSent: null,
  confirmationEmailSent: null,
  whatsappSent: null,
  whatsappLink: null,
  resendKeyConfigured: null,
  message: null,
  error: null,
  lastSentTo: null
};

export interface ResendInfo {
  checked: boolean;
  message: string;
}
