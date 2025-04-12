
interface EventDetailsProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  registrationType: string;
  role: string;
  denomination: string;
  phone: string;
  location: string;
  checkInId: string;
}

export function renderEventDetails({
  eventName,
  eventDate,
  eventTime,
  registrationType,
  role,
  denomination,
  phone,
  location,
  checkInId
}: EventDetailsProps): string {
  return `
  <!-- Confirmation Message -->
  <tr>
    <td style="padding: 20px;">
      <h2 style="margin: 0 0 15px 0; font-size: 22px; color: #3b82f6; text-align: center;">Registration Confirmation</h2>
      <p style="margin-bottom: 20px;">Thank you for registering for <strong>${eventName}</strong>.</p>
      
      <!-- Event Details Table -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <tr>
          <td colspan="2" style="padding: 10px; background-color: #f0f9ff;">
            <h3 style="margin: 0; font-size: 18px; color: #3b82f6;">Event Details</h3>
          </td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Event:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${eventName}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${eventDate}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Time:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${eventTime}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Type:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${registrationType}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Role:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${role}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Denomination:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${denomination}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;">${phone}</td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><strong>Location:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff; border-bottom: 1px solid #e5e7eb;"><a href="${location}" style="color: #3b82f6; text-decoration: underline;">View on Map</a></td>
        </tr>
        <tr>
          <td width="120" style="padding: 8px 10px; background-color: #f0f9ff;"><strong>Check-in ID:</strong></td>
          <td style="padding: 8px 10px; background-color: #f0f9ff;">${checkInId}</td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}
