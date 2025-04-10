
import { AdminEmailProps } from "../../types/emailTypes.ts";

export function generateAdminEmailContent({
  eventName,
  registrationType,
  title,
  name,
  email,
  phone,
  role,
  denomination,
  message,
  checkInId
}: AdminEmailProps): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h1 style="color: #3b82f6;">New Event Registration</h1>
      <table style="width: 100%;">
        <tr><td style="padding: 8px; width: 150px;"><strong>Event:</strong></td><td style="padding: 8px;">${eventName}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Registration Type:</strong></td><td style="padding: 8px;">${registrationType}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Title:</strong></td><td style="padding: 8px;">${title}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Name:</strong></td><td style="padding: 8px;">${name}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Email:</strong></td><td style="padding: 8px;">${email}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Phone:</strong></td><td style="padding: 8px;">${phone}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Role:</strong></td><td style="padding: 8px;">${role}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Denomination:</strong></td><td style="padding: 8px;">${denomination}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Message:</strong></td><td style="padding: 8px;">${message}</td></tr>
        <tr><td style="padding: 8px; width: 150px;"><strong>Check-in ID:</strong></td><td style="padding: 8px;">${checkInId}</td></tr>
      </table>
    </div>
  `;
}
