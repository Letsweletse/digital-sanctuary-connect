
export interface TestEmailData {
  event: string;
  eventDate: string;
  eventTime: string;
  eventImage: string;
  location: string;
  attendee: {
    title: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    denomination: string;
    numberOfAttendees: number;
  };
  message: string;
  submitDate: string;
  registrationType: string;
  churchLogo: string;
}
