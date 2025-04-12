
export function renderCalendarAdd(encodedIcsContent: string, eventName: string): string {
  return `
  <!-- Add to Calendar -->
  <tr>
    <td style="padding: 0 20px 20px 20px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f9ff; border-radius: 8px; padding: 20px;">
        <tr>
          <td align="center">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Add to Calendar</h3>
            <a href="data:text/calendar;charset=utf8,${encodedIcsContent}" download="${eventName.replace(/\s+/g, '-')}.ics" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              📅 Add to Calendar
            </a>
            <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">Works with Google Calendar, Apple Calendar, Outlook and more</p>
            <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
              Gmail users: Right-click the button, select "Save link as..." to download the .ics file, then import it to your calendar
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}
