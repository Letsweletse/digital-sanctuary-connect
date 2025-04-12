
interface SocialIconsMap {
  [key: string]: string;
}

export function getSocialIcons(): SocialIconsMap {
  return {
    facebook: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
    twitter: "https://cdn-icons-png.flaticon.com/512/5968/5968958.png", 
    linkedin: "https://cdn-icons-png.flaticon.com/512/3536/3536505.png",
    email: "https://cdn-icons-png.flaticon.com/512/561/561127.png",
    youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
    tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png"
  };
}

interface ShareWithFriendsProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  socialIcons: SocialIconsMap;
}

export function renderShareWithFriends({
  eventName,
  eventDate,
  eventTime,
  socialIcons
}: ShareWithFriendsProps): string {
  return `
  <!-- Share with Friends -->
  <tr>
    <td style="padding: 0 20px 20px 20px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f9ff; border-radius: 8px; padding: 20px;">
        <tr>
          <td align="center">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Share with Friends</h3>
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 450px;">
              <tr>
                <!-- Facebook -->
                <td align="center" style="padding: 5px; width: 20%;">
                  <a href="https://www.facebook.com/sharer/sharer.php?u=https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${socialIcons.facebook}" alt="Facebook" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;">
                    <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">Facebook</span>
                  </a>
                </td>
                
                <!-- Twitter/X -->
                <td align="center" style="padding: 5px; width: 20%;">
                  <a href="https://twitter.com/intent/tweet?text=Join%20me%20at%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone!%20Register%20here:%20https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${socialIcons.twitter}" alt="Twitter" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;">
                    <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">Twitter/X</span>
                  </a>
                </td>
                
                <!-- LinkedIn -->
                <td align="center" style="padding: 5px; width: 20%;">
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://gategaborone.com/events" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${socialIcons.linkedin}" alt="LinkedIn" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;">
                    <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">LinkedIn</span>
                  </a>
                </td>
                
                <!-- TikTok -->
                <td align="center" style="padding: 5px; width: 20%;">
                  <a href="https://www.tiktok.com/" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${socialIcons.tiktok}" alt="TikTok" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;">
                    <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">TikTok</span>
                  </a>
                </td>
                
                <!-- Email -->
                <td align="center" style="padding: 5px; width: 20%;">
                  <a href="mailto:?subject=Join%20me%20at%20${encodeURIComponent(eventName)}&body=I'm%20attending%20${encodeURIComponent(eventName)}%20at%20Gate%20Gaborone%20on%20${encodeURIComponent(eventDate)}%20at%20${encodeURIComponent(eventTime)}.%20You%20should%20join%20too!%20Register%20here:%20https://gategaborone.com/events" style="text-decoration: none; display: inline-block;">
                    <img src="${socialIcons.email}" alt="Email" width="40" height="40" style="display: block; width: 40px; max-width: 40px; height: 40px;">
                    <span style="display: block; font-size: 12px; margin-top: 5px; color: #333333;">Email</span>
                  </a>
                </td>
              </tr>
            </table>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">Invite friends and family to join you!</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}

export function renderFollowUs(socialIcons: SocialIconsMap): string {
  return `
  <!-- Follow Us -->
  <tr>
    <td style="padding: 0 20px 20px 20px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #3b82f6;">Follow Us</h3>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px;">
              <tr>
                <td align="center" style="padding: 5px;">
                  <a href="https://www.facebook.com/GateGaborone" target="_blank" style="text-decoration: none;">
                    <img src="${socialIcons.facebook}" width="40" height="40" alt="Facebook" style="display: block; width: 40px; height: 40px;">
                  </a>
                </td>
                <td align="center" style="padding: 5px;">
                  <a href="https://www.instagram.com/gategaborone" target="_blank" style="text-decoration: none;">
                    <img src="${socialIcons.instagram}" width="40" height="40" alt="Instagram" style="display: block; width: 40px; height: 40px;">
                  </a>
                </td>
                <td align="center" style="padding: 5px;">
                  <a href="https://www.youtube.com/@GateGaborone" target="_blank" style="text-decoration: none;">
                    <img src="${socialIcons.youtube}" width="40" height="40" alt="YouTube" style="display: block; width: 40px; height: 40px;">
                  </a>
                </td>
                <td align="center" style="padding: 5px;">
                  <a href="https://twitter.com/GateGaborone" target="_blank" style="text-decoration: none;">
                    <img src="${socialIcons.twitter}" width="40" height="40" alt="Twitter/X" style="display: block; width: 40px; height: 40px;">
                  </a>
                </td>
                <td align="center" style="padding: 5px;">
                  <a href="https://www.tiktok.com/" target="_blank" style="text-decoration: none;">
                    <img src="${socialIcons.tiktok}" width="40" height="40" alt="TikTok" style="display: block; width: 40px; height: 40px;">
                  </a>
                </td>
              </tr>
            </table>
            <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Stay connected with Gate Gaborone</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
}
