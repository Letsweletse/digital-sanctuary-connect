
export function renderEmailHeader(logoUrl: string, eventName: string, eventImage: string): string {
  return `
  <!-- Header with Logo -->
  <tr>
    <td align="center" style="padding: 20px; background-color: #ffffff;">
      <img src="${logoUrl}" alt="Gate Gaborone" width="180" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
    </td>
  </tr>
  
  <!-- Event Header -->
  <tr>
    <td align="center" style="background-color: #f0f9ff; padding: 20px 20px 10px 20px;">
      <h1 style="margin: 0; font-size: 24px; color: #000000; text-align: center;">${eventName}</h1>
    </td>
  </tr>
  
  <!-- Event Image -->
  <tr>
    <td align="center" style="padding: 0 20px 20px 20px; background-color: #f0f9ff;">
      <img src="${eventImage}" alt="${eventName}" width="560" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    </td>
  </tr>
  `;
}
