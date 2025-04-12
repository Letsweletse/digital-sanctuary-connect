
interface QrCodesProps {
  locationQrCodeUrl: string;
  checkInQrCodeUrl: string;
  checkInId: string;
  location: string;
}

export function renderQrCodes({
  locationQrCodeUrl,
  checkInQrCodeUrl,
  checkInId,
  location
}: QrCodesProps): string {
  return `
  <!-- QR Codes Section -->
  <tr>
    <td style="padding: 0 20px 20px 20px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <!-- Location QR Code -->
          <td class="two-col" width="48%" align="center" style="vertical-align: top;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 15px;">
              <tr>
                <td align="center">
                  <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Event Location</h3>
                  <img src="${locationQrCodeUrl}" alt="Location QR Code" width="150" style="max-width: 150px; height: auto; margin: 0 auto 10px auto; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;">
                  <p style="font-size: 14px; color: #6b7280; margin: 0;">Scan to open in Google Maps</p>
                </td>
              </tr>
            </table>
          </td>
          
          <!-- Spacer for desktop view -->
          <td class="spacer" width="4%">&nbsp;</td>
          
          <!-- Check-in QR Code -->
          <td class="two-col" width="48%" align="center" style="vertical-align: top;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 15px;">
              <tr>
                <td align="center">
                  <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Quick Check-In</h3>
                  <img src="${checkInQrCodeUrl}" alt="Check-In QR Code" width="150" style="max-width: 150px; height: auto; margin: 0 auto 10px auto; border: 1px solid #e5e7eb; padding: 5px; background-color: #fff;">
                  <p style="font-size: 14px; color: #6b7280; margin: 0;">Show this code at the door for faster check-in</p>
                  <p style="font-size: 12px; color: #6b7280; margin-top: 5px; font-style: italic;">Your Check-in ID: ${checkInId}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}
