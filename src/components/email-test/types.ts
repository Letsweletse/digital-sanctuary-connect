
export interface EmailForm {
  to: string;
  subject: string;
  name: string;
  email: string;
  message: string;
  edgeFunction: string;
  testEmail: string;
  testPhone: string;
}

export interface ResendInfo {
  checked: boolean;
  message: string;
}

export interface EmailStatus {
  isSending: boolean;
  isSuccess: boolean | null;
  adminEmailSent: boolean;
  confirmationEmailSent: boolean;
  whatsappSent: boolean;
  whatsappLink: string | null;
  resendKeyConfigured: boolean | null;
  message: string | null;
  error: string | null;
  lastSentTo: string | null;
  fallbackUsed?: boolean;
  provider?: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  resendKeyConfigured?: boolean;
  adminEmailSent?: boolean;
  confirmationEmailSent?: boolean;
  checkInId?: string;
  smsNotificationSent?: boolean;
  whatsappNotificationSent?: boolean;
  whatsappNotificationLink?: string;
  fallbackUsed?: boolean;
  provider?: string;
  data?: any;
}

export const initialStatus: EmailStatus = {
  isSending: false,
  isSuccess: null,
  adminEmailSent: false,
  confirmationEmailSent: false,
  whatsappSent: false,
  whatsappLink: null,
  resendKeyConfigured: null,
  message: null,
  error: null,
  lastSentTo: null
};

export interface ProviderHealth {
  checking: boolean;
  primary: {
    available: boolean;
    message: string;
  };
  fallback: {
    available: boolean;
    message: string;
  };
  lastChecked?: Date;
}

// Add the missing EmailTestFormData interface
export interface EmailTestFormData {
  to: string;
  subject: string;
  name: string;
  email: string;
  message: string;
  sendConfirmation?: boolean;
  isTestEmail?: boolean;
}

// Add the missing defaultFormData
export const defaultFormData: EmailTestFormData = {
  to: "",
  subject: "Test Email",
  name: "Test User",
  email: "",
  message: "This is a test email to verify email delivery.",
  sendConfirmation: true,
  isTestEmail: true
};

// Add a type for the redundancy manager response
export interface RedundancyResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider?: string;
  fallbackUsed?: boolean;
  primaryError?: string;
}
